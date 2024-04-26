export function program(statements) {
  return { kind: "Program", statements };
}

// export function variableDeclaration(variable, initializer) { return { kind: "VariableDeclaration", variable, initializer }; }
export function variableDeclaration(variable, type, initializer) {
  return { kind: "VariableDeclaration", variable, type, initializer };
}

export function variable(name, readOnly, type) {
  return { kind: "Variable", name, readOnly, type };
}

export const boolType = { kind: "BoolType" };
export const intType = { kind: "IntType" };
export const floatType = { kind: "FloatType" };
export const stringType = { kind: "StringType" };
export const voidType = { kind: "VoidType" };
export const anyType = { kind: "AnyType" };

//==================== (VALID STATEMENTS) ====================//
export function printStatement(argument) {
  return { kind: "PrintStatement", argument };
}

export function functionDeclaration(fun, params, body) {
  return { kind: "FunctionDeclaration", fun, params, body };
}

export function fun(name, type) {
  return { kind: "Function", name, type };
}

export function assignment(target, source) {
  return { kind: "Assignment", target, source };
}

export function whileStatement(test, body) {
  return { kind: "WhileStatement", test, body };
}

export function forRangeStatement(iterator, low, op, high, body) {
  return { kind: "ForRangeStatement", iterator, low, op, high, body };
}

export function forStatement(iterator, collection, body) {
  return { kind: "ForStatement", iterator, collection, body };
}

export function functionCall(callee, args) {
  // This can appear within a CallStatement or as a primary expression
  return { kind: "Call", callee, args, type: callee.type.returnType };
}

export function callStatement(call) {
  return { kind: "CallStatement", call}
}

export function ifStatement(test, consequent, alternate) {
  return { kind: "IfStatement", test, consequent, alternate };
}

export function shortIfStatement(test, consequent) {
  return { kind: "ShortIfStatement", test, consequent };
}

export const passStatement = { kind: "PassStatement" };

export const breakStatement = { kind: "BreakStatement" };

export function returnStatement(expression) {
  return { kind: "ReturnStatement", expression };
}

export function shortReturnStatement() {
  return { kind: "ShortReturnStatement" };
}

export function tryStatement(body, catchClause, errors) {
  return { kind: "TryStatement", body, catchClause, errors};
}

// export function await_exp(exp) {
//   return { kind: "Await", exp };
// }
//==========================( EXPRESSIONS )================================//
export function binary(op, left, right, type) {
  return { kind: "BinaryExpression", op, left, right, type };
}

export function unary(op, operand, type) {
  return { kind: "UnaryExpression", op, operand, type };
}

// TODO: Fix to work with dictionaries
export function index(iterable, index) {
  return {
    kind: "IndexExpression",
    iterable,
    index,
    type: iterable.type?.baseType ?? iterable.type,
  };
}

//------------------------------- (TYPES) ---------------------------------//
export function functionType(paramTypes, returnType) {
  // paramTypes suppposed to be an array of something
  return { kind: "FunctionType", paramTypes, returnType };
}

export function optionalType(baseType) {
  return { kind: "OptionalType", baseType };
}

export function promiseType(baseType) {
  return { kind: "PromiseType", baseType };
}

export function arrayType(baseType) {
  return { kind: "ArrayType", baseType };
}


export function arrayLiteral(elements) {
  // TODO: Modify to accept 'type' so that it tracks the basetype
  return { kind: "ArrayLiteral", elements, type: arrayType(elements[0].type) };
}

export function dictionaryType(keyBaseType, baseType) {
  return { kind: "DictionaryType", keyBaseType, baseType };
}

export function dictionaryLiteral(elements) {
  if (elements.length === 0) {
    return { kind: "DictionaryLiteral", elements: [], type: dictionaryType('any', 'any') };
  }
  let keyType = elements[0].key.type;
  let valueType = elements[0].value.type;
  for (let entry of elements) {
    if (entry.key.type !== keyType || entry.value.type !== valueType) {
      throw new Error("Inconsistent key or value types in dictionary literal");
    }
  }
  return { kind: "DictionaryLiteral", elements: elements, type: dictionaryType(keyType, valueType) };
}

export function dictionaryEntry(key, value) {
  return { kind: "DictionaryEntry", key, value };
}

export function emptyOptional(baseType) {
  return { kind: "EmptyOptional", type: optionalType(baseType) };
}

export function emptyArrayLiteral() {
  return { kind: "EmptyArray", type: arrayType(anyType) };
}


export function emptyDictLiteral(type1, type2) {
  return { kind: "EmptyDictionary", type1, type2 };
}

// These local constants are used to simplify the standard library definitions.
const floatToFloatType = functionType([floatType], floatType);
const floatFloatToFloatType = functionType([floatType, floatType], floatType);
const stringToIntsType = functionType([stringType], arrayType(intType));
const anyToVoidType = functionType([anyType], voidType);

export const standardLibrary = Object.freeze({
  int: intType,
  float: floatType,
  bool: boolType,
  str: stringType,
  void: voidType,
  any: anyType,
  π: new variable("π", true, floatType),
  print: fun("print", anyToVoidType),
  sin: fun("sin", floatToFloatType),
  cos: fun("cos", floatToFloatType),
  exp: fun("exp", floatToFloatType),
  ln: fun("ln", floatToFloatType),
  hypot: fun("hypot", floatFloatToFloatType),
  bytes: fun("bytes", stringToIntsType),
  codepoints: fun("codepoints", stringToIntsType),
});

String.prototype.type = stringType;
Number.prototype.type = floatType;
BigInt.prototype.type = intType;
Boolean.prototype.type = boolType;
