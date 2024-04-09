import * as core from "./core.js";


const astBuilder = core.grammar.createSemantics().addOperation("ast", {
  Program(body){
    // building a node for the program
    // for (const statement of body.children){
      // statement.ast();
    // }
    return new core.Program(body)
    // return "IT BEGINS"
    // return null
  },
  Stmt_print(_print, expression, _semicol){
    // console.log(expression.ast());
    return new core.PrintStatement(expression.ast())
  },
  Stmt_vardec(_let, id, _semicols, types, _eq, initializer, _semicol){
    return new core.PrintStatement(id.ast(), types.ast()[0] ?? null, initializer.ast())
  },
  Stmt_constdec(_const, id, _semicols, types, _eq, initializer, _semicol){
    return new core.PrintStatement(id.ast(), types.ast()[0] ?? null, initializer.ast())
  },
  Stmt_assign(target, _eq, source, _semicol){
    return new core.Assignment(target.ast(),source.ast())
  },
  Stmt_while(_while, test, body){
    return new core.WhileStatement(test.ast(),body.ast())
  },
  Stmt_break(_break, _semicol){
    return new core.BreakStatement()
  },
  Stmt_fundec(_func, id, params, _colon, returnType, body){
    return new core.FunctionDeclaration(id.ast(), params.ast(), returnType.ast(), returnType.ast())
  },
  Stmt_try(_try, mainBlock, _timeouts, timeBlocks, _catch, params, catchBlock){
    return new core.TryStatement(
      mainBlock.ast(), 
      timeBlocks.ast(), 
      params.ast(), 
      catchBlock.ast()
    )

  },
  IfStmt_if(_if, test, consequent, _elses, alternate){
    return new core.TryStatement(test.ast(), consequent.ast(), alternate.ast())
  },
  Params(_open, params, _close){
    // ohm key . operation 'asIteration'
    return params.asIteration().ast();
  },
  Param(id, _colon, type){
    return new core.Parameter(id.ast(), type.ast())
  },
  Args(_open, expressions, _close){
    return expressions.asIteration().ast();
  },
  Block(_open, statements, _close){
    // the _iter() below is what lets us do this
    return statements.ast();
  },
//-----------------------------------------------------------
  Exp_unwrap(left, op, right){
    return new core.BinaryExpresion(op.ast(), left.ast(), right.ast())
  },
  Exp_unary(op, operand){
    return new core.UnaryExpresion(op.ast(), operand.ast())
    
  },
  Exp_await(_await, _opens, timeouts, _closes, quantifiers, operand){
    return new core.AwaitExpression(
      timeouts.ast(), 
      quantifiers.ast()[0] ?? null, 
      operand.ast()
      )
      
    },
  Exp0_binary(left, op, right){
    return new core.BinaryExpresion(op.ast(), left.ast(), right.ast())
  },
  Disjunct_binary(left, op, right){
    return new core.BinaryExpresion(op.ast(), left.ast(), right.ast())
  },
  Conjunct_binary(left, op, right){
    return new core.BinaryExpresion(op.ast(), left.ast(), right.ast())
  },
  
  Comp_additive(left, op, right){
    // if (op.ast() == "+"){
    //   return left.ast() + right.ast()
    // }
    // return left.ast() - right.ast()
    return new core.BinaryExpresion(op.ast(), left.ast(), right.ast())
  },
  Term_multiplicative(left, op, right){
    return new core.BinaryExpresion(op.ast(), left.ast(), right.ast())
  },
  Factor_binary(left, op, right){
    return new core.BinaryExpresion(op.ast(), left.ast(), right.ast())
  },
  Primary_wrapped(some, operand){
    return new core.UnaryExpresion(some.ast(), operand.ast())
  },
  Primary_emptyoptional(_no, type){
    return new core.EmptyOptional(type.ast())
  },
  Primary_lookup(object, _open, member, _close){
    return new core.Lookup(object.ast(), member.ast())
  },
  Primary_call(callee,args){
    return new core.Call(callee.ast(), args.ast())
  },
  Primary_typeconversion(_open,expression, _as, type, _close){
    return new core.TypeConversion(expression.ast(), type.ast())
  },
  Primary_parens(_open, expression, _close){
    return expression.ast()
  },
  Primary_arraylit(_open, members, _close){
    return new core.ArrayLiteral(members.asIteration().ast())
  },
  Primary_dictionarylit(_open, bindings, _close){
    return new core.DictionaryLiteral(bindings.asIteration().ast())
  },
  Binding(key, _colon, value){
    return new core.Binding(key.ast(), value.ast())
  },
  Type_optional(type,_question){
    return new core.OptionalType(type.ast())
  },
  Type_promise(type, _caret){
    return new core.PromiseType(type.ast())
  },
  Type_array(_open, type, _close){
    return new core.ArrayType(type.ast())
  },
  Type_dictionary(_open, keyType, _colon, valueType, _close){
    return new core.DictionaryType(keyType.ast(), valueType.ast())
  },
  
  id(_first,_rest){
    return new core.Identifier(this.sourceString)
  },
  
  intlit(_digits){
    return Number(_digits.sourceString)
    return new core.Literal("int", this.sourceString)
  },
  floatlit(_whole,_point, _fraction,_e, _sign,_exponent){
    return new core.Literal("float", this.sourceString)
    
  },
  strlit(_open, chars, _close){
    return new core.Literal("string", this.sourceString)
  },
  
  // recall we had a difference in upper and lower case variables 
  // so the terminals (lower case) can have their functionality abstracted with Ohm
  _terminal(){
    return new core.Symbol(this.sourceString)
  },
  //arrayprocessing : 
  _iter(...children){
    return children.map((child) => child.ast())
  }
})

export default function ast(match){
  return astBuilder(match).ast();
}

