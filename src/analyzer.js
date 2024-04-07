// The semantic analyzer exports a single function, analyze(match), that
// accepts a grammar match object (the CST) from Ohm and produces the
// internal representation of the program (pretty close to what is usually
// called the AST). This representation also includes entities from the
// standard library, as needed.
import * as core from "./core.js";

const INT = core.Type.INT;
const FLOAT = core.Type.FLOAT;
const STRING = core.Type.STRING;
const BOOLEAN = core.Type.BOOLEAN;
const ANY = core.Type.ANY;
const VOID = core.Type.VOID;

function must(condition, message, errorLocation) {
  if (!condition) {
    const prefix = errorLocation.at.source.getLineAndColumnMessage();
    throw new Error(`${prefix}${message}`);
  }
}

class Context {
  constructor({ parent, locals = {} }) {
    this.parent = parent;
    this.locals = new Map(Object.entries(locals));
    this.withinLoop = false;
    this.function = null;
  }
  add(name, entity) { this.locals.set(name, entity); }

  lookup(name) { return this.locals.get(name) || this.parent?.lookup(name); }

  static root() { return new Context({ locals: new Map(Object.entries(core.standardLibrary)) }); }

  newChildContext(props) { return new Context({ ...this, ...props, parent: this, locals: new Map() }); }

  get(name, expectedType, node) {
    let entity;
    for (let context = this; context; context = context.parent) {
      entity = context.locals.get(name);
      if (entity) break;
    }
    must(entity, `${name} has not been declared`, node);
    must(
      entity.constructor === expectedType,
      `${name} was expected to be a ${expectedType.name}`,
      node
    );
    return entity;
  }
}

function mustHaveNumericType(e, at) { must([INT, FLOAT].includes(e.type), "Expected a number", at); }

function mustHaveArrayType(e, at) { must(e.type?.kind === "ArrayType", "Expected an array", at); }

function mustHaveIterableType(e, at) {
  must((e.type?.kind === "ArrayType" | e.type?.kind === "DictType" | e.type?.kind === STRING), "Expected an array", at);
}

function mustHaveNumericOrStringType(e, at) {
  must(
    [INT, FLOAT, STRING].includes(e.type),
    "Expected a number or string",
    at
  );
}

function mustHaveBooleanType(e, at) { must(e.type === BOOLEAN, "Expected a boolean", at); }

function mustHaveIntegerType(e, at) { must(e.type === INT, "Expected an integer", at); }

function mustBeTheSameType(e1, e2, at) { must(equivalent(e1.type, e2.type), "Operands do not have the same type", at); }

function equivalent(t1, t2) {
  return (
    t1 === t2 ||
    (t1 instanceof core.OptionalType &&
      t2 instanceof core.OptionalType &&
      equivalent(t1.baseType, t2.baseType)) ||
    (t1 instanceof core.ArrayType &&
      t2 instanceof core.ArrayType &&
      equivalent(t1.baseType, t2.baseType)) ||
    (t1.constructor === core.FunctionType &&
      t2.constructor === core.FunctionType &&
      equivalent(t1.returnType, t2.returnType) &&
      t1.paramTypes.length === t2.paramTypes.length &&
      t1.paramTypes.every((t, i) => equivalent(t, t2.paramTypes[i])))
  );
}

export default function analyze(match) {
  // Track the context manually via a simple variable. The initial context
  // contains the mappings from the standard library. Add to this context
  // as necessary. When needing to descent into a new scope, create a new
  // context with the current context as its parent. When leaving a scope,
  // reset this variable to the parent context.
  let context = Context.root();

  // The single gate for error checking. Pass in a condition that must be true.
  // Use errorLocation to give contextual information about the error that will
  // appear: this should be an object whose "at" property is a parse tree node.
  // Ohm's getLineAndColumnMessage will be used to prefix the error message.
  
  function mustBeInLoop(context, at) { must(context.withinLoop, "Break statement must be inside a loop", at); }
  function mustNotAlreadyBeDeclared(name, at) { must(!context.locals.has(name), `Identifier ${name} already declared`, at); }

  function mustHaveBeenFound(entity, name, at) { must(entity, `Identifier ${name} not declared`, at); }

  function mustBeAVariable(entity, at) { must(entity?.kind === "Variable", `Functions can not appear here`, at); }

  function mustBeAFunction(entity, at) { must(entity?.kind === "Function", `${entity.name} is not a function`, at); }

  function mustNotBeReadOnly(entity, at) { must(!entity.readOnly, `${entity.name} is read only`, at); }

  function mustHaveCorrectArgumentCount(argCount, paramCount, at) {
    const equalCount = argCount === paramCount;
    must(
      equalCount,
      `${paramCount} argument(s) required but ${argCount} passed`,
      at
    );
  }

  const builder = match.matcher.grammar.createSemantics().addOperation("rep", {
    Program(statements) {
      return core.program(statements.children.map((s) => s.rep()));
    },

    //==================== (VALID STATEMENTS) ====================//
    Stmt_print(_print, _lparen, exp, _rparen, _semicolon) {
      return core.printStatement(exp.rep());
    },

    //Variable Declaration
    Stmt_vardec(modifier, id, _colon, type, _eq, exp, _semicolon) {
      // TODO: Need to do something else with the 'type'
      const initializer = exp.rep();
      const readOnly = modifier.sourceString === "const";
      const variable = core.variable(
        id.sourceString,
        readOnly,
        initializer.type
      );

      mustNotAlreadyBeDeclared(id.sourceString, { at: id });
      // TODO: Add type checking
      // exp must be of type 'type'
      context.add(id.sourceString, variable);
      // Need to make sure this we can both read and write to this variable

      return core.variableDeclaration(variable, initializer);
    },

    //Assignment
    Stmt_assign(id, ops, _eq, exp, _semicolon) {
      const target = id.rep();
      mustNotBeReadOnly(target, { at: id });
      return core.assignment(target, exp.rep());
    },

    //Call
    Stmt_call(call, _semicolon) {
      return core.callStatement(call.rep());
    },

    //Pass
    Stmt_pass(_pass, _semicolon) {
      return core.passStatement();
    },
    //Break
    Stmt_break(breakKeyword, _semicolon) {
      mustBeInLoop(context, { at: breakKeyword });
      return core.breakStatement();
    },
    //Return
    Stmt_return(_return, exp, _semicolon) {
      return core.returnStatement(exp.rep());
    },

    //Function Declaration
    FuncDecl(type, id, parameters, block) {
      mustNotAlreadyBeDeclared(id.sourceString, { at: id });

      const fun = new core.fun(id.sourceString, params.length);
      context.add(id.sourceString, fun);
      // Add the function to the context before analyzing the body, because
      // we want to allow functions to be recursive

      context = context.newChildContext({ inLoop: false, function: fun });
      const params = parameters.rep();
      // console.log(params)

      const paramTypes = params.map(param => param.type);
      const returnType = type.children?.[0]?.rep() ?? VOID;
      fun.type = new core.functionType(paramTypes, returnType);

      const bodyRep = block.rep();

      context = context.parent;
      return new core.functionDeclaration(fun, params, bodyRep);
    },

    //While
    LoopStmt_while(_while, exp, block) {
      return core.whileStatement(exp.rep(), block.rep());
    },

    //For
    LoopStmt_foreach(_for, iterator, _in, exp, block) {
      const iterable = exp.rep()
      mustHaveIterableType(iterable, { at: exp });
      return core.forStatement(iterator.sourceString, iterable.rep(), block.rep());
    },

    LoopStmt_range(_for, id, _in, exp1, range, exp2, block) {
      const [low, high] = [exp1.rep(), endpoint]
      mustHaveIntegerType(low, { at: exp1 })
      mustHaveIntegerType(high, { at: exp2 })
      const endpoint = range === "..<" ? high : high - 1
      const iterator = core.variable(id.sourceString, false, INT)
      context = context.newChildContext({ inLoop: true })
      context.add(id.sourceString, iterator)
      const body = block.rep()
      context = context.parent
      return core.forRangeStatement(iterator, low, range, endpoint, body)
    },

    Call(id, args) {
      // ids used in calls must have already been declared and must be
      // bound to function entities, not to variable entities.
      const callee = context.lookup(id.sourceString);
      mustHaveBeenFound(callee, id.sourceString, { at: id });
      mustBeAFunction(callee, { at: id });
      const passed = args.rep()
      mustHaveCorrectArgumentCount(passed.length, callee.paramCount, { at: id });
      return core.call(callee, passed);
    },

    Args(_open, expList, _close) {
      return expList.asIteration().children.map((exp) => exp.rep());
    },

    // //If
    IfStmt_if(_if, exp, block) {
      const test = exp.rep()
      mustHaveBooleanType(test, { at: exp })
      context = context.newChildContext()
      const consequent = block.rep()
      context = context.parent
      return core.shortIfStatement(test, consequent)
    },

    IfStmt_else(_if, exp, block1, _else, block2) {
      const test = exp.rep()
      mustHaveBooleanType(test, { at: exp })
      context = context.newChildContext()
      const consequent = block1.rep()
      context = context.parent
      context = context.newChildContext()
      const alternate = block2.rep()
      context = context.parent
      return core.ifStatement(test, consequent, alternate)
    },

    IfStmt_elseif(_if, exp, block, _else, trailingIfStatement) {
      const test = exp.rep()
      mustHaveBooleanType(test, { at: exp })
      context = context.newChildContext()
      const consequent = block.rep()
      context = context.parent
      const alternate = trailingIfStatement.rep()
      return core.ifStatement(test, consequent, alternate)
    },

    TryStmt_catch(_try, block1, _catch, parameters, block2) {
      context = context.newChildContext()
      const tryBlock = block1.rep()
      context = context.parent
      context = context.newChildContext()
      const params = parameters.rep()
      // context.add(pa)
      const catchBlock = block2.rep()
      context = context.parent
      return core.tryStatement(tryBlock, catchBlock, params, block3.rep())
    },

    TryStmt_timeout(_try, block1, _timeout, block2, _catch, parameters, block3) {
      context = context.newChildContext()
      const tryBlock = block1.rep()
      context = context.parent
      context = context.newChildContext()
      const timeoutBlock = block2.rep()
      context = context.parent
      const params = parameters.rep()
      return core.tryStatement(tryBlock, timeoutBlock, params, block3.rep())
    },


    Params(_open, paramList, _close) {
      // Returns a list of variable nodes
      return paramList.asIteration().children.map((p) => p.rep())
    },

    Param(id, _colon, type) {
      const param = core.variable(id.sourceString, false, type.rep())
      mustNotAlreadyBeDeclared(param.name, { at: id })
      context.add(param.name, param)
      return param
    },

    Block(_open, statements, _close) {
      return statements.children.map((s) => s.rep());
    },
    //==================== (EXPRESSIONS) ====================//

    Exp_unwrap(exp1, op, exp2) {
      return core.binary(op.sourceString, exp1.rep(), exp2.rep());
    },

    Exp_unary(op, exp) {
      // either for negation or for boolean not
      return core.unary(op.sourceString, exp.rep());
    },

    // Exp_await(_await, exp) {
    //   return core.await(exp.rep())
    // }

    Exp0_logicalor(exp1, _or, exp2) {
      let left = exp1.rep()
      mustHaveBooleanType(left, { at: exp1 })
      for (let e of exp2.children) {
        let right = e.rep()
        mustHaveBooleanType(right, { at: e })
        left = core.binary("||", left, right, BOOLEAN)
      }

      return left
    },

    Disjunct_logicaland(exp, _and, exps) {
      let left = exp.rep()
      mustHaveBooleanType(left, { at: exp })
      for (let e of exps.children) {
        let right = e.rep()
        mustHaveBooleanType(right, { at: e })
        left = core.binary("&&", left, right, BOOLEAN)
      }
      return left
    },
    
    Conjunct_comparative(exp1, relOp, exp2) {
      const [left, op, right] = [exp1.rep(), relOp.sourceString, exp2.rep()]

      if (["<", "<=", ">", ">="].includes(op)) {
        mustHaveNumericOrStringType(left, { at: exp1 });
      }
      mustBeTheSameType(left, right, { at: relOp });

      return core.binary(op.sourceString, exp1.rep(), exp2.rep(), BOOLEAN);
    },
    
    Comp_additive(exp1, addOp, exp2) {
      // plus or minus
      const [left, op, right] = [exp1.rep(), addOp.sourceString, exp2.rep()]
      if (op === "+") {
        mustHaveNumericOrStringType(left, { at: exp1 })
      } else {
        mustHaveNumericType(left, { at: exp1 })
      }
      mustBothHaveTheSameType(left, right, { at: addOp })
      return core.binary(op, left, right, left.type)
    },
    
    Term_multiplicative(exp1, mulOp, exp2) {
      const [left, op, right] = [exp1.rep(), mulOp.sourceString, exp2.rep()]
      mustHaveNumericType(left, { at: exp1 })
      mustBothHaveTheSameType(left, right, { at: mulOp })
      return core.binary(op, left, right, left.type)
    },
    
    Factor_exponent(exp1, powerOp, exp2) {
      // exponentiation
      const [left, op, right] = [exp1.rep(), powerOp.sourceString, exp2.rep()]
      mustHaveNumericType(left, { at: exp1 })
      mustBothHaveTheSameType(left, right, { at: powerOp })
      return core.binary(op, left, right, left.type)
    },

    Primary_wrapped(_some, exp) {

    },

    Primary_index(exp1, _open, exp2, _close) {
      const [array, index] = [exp1.rep(), exp2.rep()];
      mustHaveArrayType(array, { at: exp1 });
      mustHaveIntegerType(index, { at: exp2 });
      return core.index(array, index)
    },

    Primary_id(id) {
      // ids used in expressions must have been already declared and must
      // be bound to variable entities, not function entities.
      const entity = context.lookup(id.sourceString);
      mustHaveBeenFound(entity, id.sourceString, { at: id });
      mustBeAVariable(entity, { at: id });
      return entity;
    },

    ArrayLit(_open, expList, _close) {
      return core.arrayLiteral(
        expList.asIteration().children.map((exp) => exp.rep())
      );
    },

    DictLit(_open, bindings, _close) {
      return core.dictLiteral(
        bindings.asIteration().children.map((b) => b.rep())
      );
    },

    Parens(_open, exp, _close) {
      return exp.rep();
    },
    //Dictionary stuff
    Binding(key, _colon, value) {
      return [key.rep(), value.rep()];
    },

    //-------------------- (TYPES) -------------------//
    Type_optional(baseType, _question) {
      return core.optionalType(baseType.rep());
    },

    Type_promise(baseType, _promise) {
      return core.promiseType(baseType.rep());
    },

    Type_array(_open, baseType, _close) {
      return core.arrayType(baseType.rep());
    },

    Type_dictionary(_open, baseType1, _colon, type2, _close) {
      return core.dictionaryType(baseType1.rep(), type2.rep());
    },

    Type_id(_id) {
      return context.lookup(this.sourceString);
    },

    true(_) {
      return true;
    },

    false(_) {
      return false;
    },

    strlit(_openQuote, _chars, _closeQuote) {
      // strings will be represented as plain JS strings, including
      // the quotation marks
      return this.sourceString;
    },

    intlit(_digits) {
      // ints will be represented as plain JS bigints
      return BigInt(this.sourceString);
    },

    floatlit(_whole, _point, _fraction, _e, _sign, _exponent) {
      // floats will be represented as plain JS numbers
      return Number(this.sourceString);
    },
  });
  return builder(match).rep();
}
