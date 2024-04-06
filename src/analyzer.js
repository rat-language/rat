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

class Context {
  constructor({ parent, locals = {} }) {
    this.parent = parent;
    this.locals = new Map(Object.entries(locals));
    this.withinLoop = false;
    this.function = null;
  }
  add(name, entity) {
    this.locals.set(name, entity);
  }
  lookup(name) {
    return this.locals.get(name) || this.parent?.lookup(name);
  }
  static root() {
    return new Context({
      locals: new Map(Object.entries(core.standardLibrary)),
    });
  }
  newChildContext(props) {
    return new Context({ ...this, ...props, parent: this, locals: new Map() });
  }
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

function mustHaveNumericType(e, at) {
  must([INT, FLOAT].includes(e.type), "Expected a number", at);
}

function mustHaveArrayType(e, at) {
  must(e.type?.kind === "ArrayType", "Expected an array", at);
}

function mustHaveNumericOrStringType(e, at) {
  must(
    [INT, FLOAT, STRING].includes(e.type),
    "Expected a number or string",
    at
  );
}
function mustHaveBooleanType(e, at) {
  must(e.type === BOOLEAN, "Expected a boolean", at);
}
function mustHaveIntegerType(e, at) {
  must(e.type === INT, "Expected an integer", at);
}
function mustBeTheSameType(e1, e2, at) {
  must(equivalent(e1.type, e2.type), "Operands do not have the same type", at);
}

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
  function must(condition, message, errorLocation) {
    if (!condition) {
      const prefix = errorLocation.at.source.getLineAndColumnMessage();
      throw new Error(`${prefix}${message}`);
    }
  }

  function mustNotAlreadyBeDeclared(name, at) {
    must(!context.locals.has(name), `Identifier ${name} already declared`, at);
  }

  function mustHaveBeenFound(entity, name, at) {
    must(entity, `Identifier ${name} not declared`, at);
  }

  function mustBeAVariable(entity, at) {
    // Bella has two kinds of entities: variables and functions.
    must(entity?.kind === "Variable", `Functions can not appear here`, at);
  }

  function mustBeAFunction(entity, at) {
    must(entity?.kind === "Function", `${entity.name} is not a function`, at);
  }

  function mustNotBeReadOnly(entity, at) {
    must(!entity.readOnly, `${entity.name} is read only`, at);
  }

  function mustHaveCorrectArgumentCount(argCount, paramCount, at) {
    const equalCount = argCount === paramCount;
    must(
      equalCount,
      `${paramCount} argument(s) required but ${argCount} passed`,
      at
    );
  }

  /*
   
  */

  const builder = match.matcher.grammar.createSemantics().addOperation("rep", {
    // what we gotta add to builder:
    Primary_id() { },
    Primary_lookup() { },
    Primary_wrapped() { },
    Iterable() { },
    Iterable_iterableTypeConversion() { },
    LhsExp() { },
    Index() { }, //riley done
    Binding() { }, //riley done
    DictLit() { },
    IfStmt_if() { },
    IfStmt_ifshort() { },
    IfStmt_iflong() { },
    Type_optional() { }, //riley 
    Type_promise() { }, //riley
    TryStmt() { },
    IterableType_array() { },
    IterableType_dictionary() { },
    ExclusiveRng() { },
    InclusiveRng() { },
    ForStmt() { },
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

    //While
    Stmt_while(_while, exp, block) {
      return core.whileStatement(exp.rep(), block.rep());
    },

    //For
    ForStmt(_for, id, _in, iterable, block) {
      return core.forStatement(id.sourceString, iterable.rep(), block.rep());
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

    //Call
    Stmt_call(call, _semicolon) {
      return core.callStatement(call.rep());
    },

    // //If
    // IfStmt(_if, exp, block, _else, elseBlock) {
    //   //TODO
    // },

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
      mustBeAFunction(context, { at: _return });
      return core.returnStatement(exp.rep());
    },

    // //Try
    // Stmt_try(_try, block, timeoutKeyword, block, _catch, _open, params, _close, block) {
    //   //TODO
    // },

    //Function Declaration
    FuncDecl(type, id, parameters, body) {
      const fun = new core.Function(id.sourceString, params.length, true);
      mustNotAlreadyBeDeclared(id.sourceString, { at: id });
      context.add(id.sourceString, fun);
      // Add the function to the context before analyzing the body, because
      // we want to allow functions to be recursive

      context = context.newChildContext({ inLoop: false, function: fun });
      const params = params.rep();

      const paramTypes = params.map((p) => p.type);
      const returnType = type.children?.[0]?.rep() ?? VOID;
      fun.type = new core.FunctionType(paramTypes, returnType);

      const bodyRep = body.rep();

      context = context.parent;
      return new core.functionDeclaration(fun, params, bodyRep);
    },

    Params(_open, paramList, _close) {
      // Returns a list of variable nodes
      return paramList.asIteration().children.map((p) => p.rep());
    },

    Param(id, _colon, type) {
      const param = core.variable(id.sourceString, false, type.rep());
      mustNotAlreadyBeDeclared(param.name, { at: id });
      context.add(param.name, param);
      return param;
    },

    Block(_open, statements, _close) {
      return statements.children.map((s) => s.rep());
    },

    Primary_index(exp1, _open, exp2, _close) {
      const [array, index] = [exp1.rep(), exp2.rep()];
      mustHaveArrayType(array, { at: exp1 });
      mustHaveIntegerType(index, { at: exp2 });
      return core.index(array, index)
    },

    //Dictionary stuff
    Binding(key, _colon, value) {
      return [key.rep(), value.rep()];
    },

    // LhsExp(id, index) {

    // }

    // arr[2][1] =
    /*
IDK how to properly name these statement functions,
I'm thinking that I might need to go back and re-write the ohm grammars, for now, I'm naming them the variable names...
*/

    //==================== (EXPRESSIONS) ====================//
    Exp_unwrap(exp1, op, exp2) {
      return core.binary(op.sourceString, exp1.rep(), exp2.rep());
    },

    Exp_unary(op, exp) {
      // either for negation or for boolean not
      return core.unary(op.sourceString, exp.rep());
    },

    // IDK HOW TO DO THIS ONE YET!!!
    // Exp_await(_await, exp) {
    //   return core.await(exp.rep())
    // }

    Exp0_logicalor(exp1, _or, exp2) {
      return core.binary("||", exp1.rep(), exp2.rep());
    },

    Disjunct_logicaland(exp1, _and, exp2) {
      return core.binary("&&", exp1.rep(), exp2.rep());
    },

    Conjunct_comparative(exp1, op, exp2) {
      // "<=" | "<" | "==" | "!=" | ">=" | ">"
      return core.binary(op.sourceString, exp1.rep(), exp2.rep());
    },

    Comp_additive(exp1, op, exp2) {
      // plus or minus
      return core.binary(op.sourceString, exp1.rep(), exp2.rep());
    },

    Term_multiplicative(exp1, op, exp2) {
      // times, divide, or modulo
      return core.binary(op.sourceString, exp1.rep(), exp2.rep());
    },

    Factor_exponent(exp1, _op, exp2) {
      // exponentiation
      return core.binary("**", exp1.rep(), exp2.rep());
    },

    // IDK HOW TO DO THIS ONE YET!!!
    // Primary_wrapped(_open, exp, _close) { return exp.rep() },
    // Primary_lookup(id) {},



    ArrayLit(_open, expList, _close) {
      return core.arrayLiteral(
        expList.asIteration().children.map((exp) => exp.rep())
      );
    },

    // THIS IS DEFINITELY WRONG BUT WE'LL FIX IT LATER
    // DictList(_open, keyValList, _close) {
    //   return core.dictLiteral(keyValList.asIteration().children.map(kv => kv.rep()))
    // },
    //-------------------- (TYPES) -------------------//
    TypeConv(type, _open, exp, _close) {
      return core.typeConversion(type.sourceString, exp.rep());
    },

    Parens(_open, exp, _close) {
      return exp.rep();
    },

    Args(_open, expList, _close) {
      return expList.asIteration().children.map((exp) => exp.rep());
    },
    Primary_id(id) {
      // ids used in expressions must have been already declared and must
      // be bound to variable entities, not function entities.
      const entity = context.lookup(id.sourceString);
      mustHaveBeenFound(entity, id.sourceString, { at: id });
      mustBeAVariable(entity, { at: id });
      return entity;
    },

    true(_) {
      return true;
    },

    false(_) {
      return false;
    },

    intlit(_digits) {
      // ints will be represented as plain JS bigints
      return BigInt(this.sourceString);
    },

    floatlit(_whole, _point, _fraction, _e, _sign, _exponent) {
      // floats will be represented as plain JS numbers
      return Number(this.sourceString);
    },

    strlit(_openQuote, _chars, _closeQuote) {
      // strings will be represented as plain JS strings, including
      // the quotation marks
      return this.sourceString;
    }
  });
  return builder(match).rep();
}
