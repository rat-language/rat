export function program(statements) {
  return { kind: "Program", statements };
}

export class Type {
  // Type of all basic type int, float, string, etc. and superclass of others
  static BOOLEAN = new Type("bool");
  static INT = new Type("int");
  static FLOAT = new Type("float");
  static STRING = new Type("str");
  static VOID = new Type("void");
  static ANY = new Type("any");
  constructor(description) {
    // The description is a convenient way to view the type. For basic
    // types or structs, it will just be the names. For arrays, you will
    // see "[T]". For optionals, "T?". For functions "(T1,...Tn)->T0".
    Object.assign(this, { description });
  }
}

//==================== (VALID STATEMENTS) ====================//
export function printStatement(argument) {
  return { kind: "PrintStatement", argument };
}

export function variableDeclaration(variable, initializer) {
  return { kind: "VariableDeclaration", variable, initializer };
}
/*
var x:int = 42;

{
  kind: "VariableDeclaration",
  variable: { 
    kind: "Variable", 
    name: "x", 
    readOnly: false 
  },
  initializer: { 
    kind: "IntLiteral", 
    value: 42
  }
}
*/

export function variable(name, readOnly, type) {
  return { kind: "Variable", name, readOnly, type };
}

export function constantDeclaration(variable, initializer) {
  // temporary
  return { kind: "ConstantDeclaration", variable, initializer };
}

// Must be changed
export function assignment(target, source) {
  return { kind: "Assignment", target, source };
}

// NOTE: This can stay the same
export function whileStatement(test, body) {
  return { kind: "WhileStatement", test, body };
}

// ***************** (NEW) ***************** //
// export function forRangeStatement(iterator, low, op, high, body) {
//   return { kind: "ForRangeStatement", iterator, low, op, high, body }
// }

export function forStatement(init, test, update, body) {
  return { kind: "WhileStatement", test, body };
}

export function callStatement(call) {
  return { kind: "CallStatement", call };
}

export function call(callee, args) {
  // This can appear within a CallStatement or as a primary expression
  return { kind: "Call", callee, args };
}

// Note: This can stay the same
export function conditional(test, consequent, alternate) {
  return { kind: "Conditional", test, consequent, alternate };
}

export function passStatement(_pass, _semicolon) {
  return { kind: "PassStatement" };
}

export function breakStatement(_break, _semicolon) {
  return { kind: "BreakStatement" };
}

export function returnStatement(expression) {
  return { kind: "ReturnStatement", expression };
}

// ***************** (NEW) ***************** //
export function tryStatement(body, catchClause, finallyClause) {
  return { kind: "TryStatement", body, catchClause, finallyClause };
}

// Must be changed
export function functionDeclaration(fun, params, body) {
  return { kind: "FunctionDeclaration", fun, params, body };
}

export function fun(name, paramCount) {
  return { kind: "Function", name, paramCount };
}

// ***************** (NEW) ***************** //
export function importStatement() {}

// ***************** (NEW) ***************** //
export function importFromStatement() {}

export function index(array, index) {
  return { kind: "IndexExpression", array, index, type: array.type.baseType };
}

//==========================( EXPRESSIONS )================================//

export function binary(op, left, right) {
  return { kind: "BinaryExpression", op, left, right };
}

export function unary(op, operand) {
  return { kind: "UnaryExpression", op, operand };
}

//------------------------------- (TYPES) ---------------------------------//
export function optionalType(baseType) {
  return { kind: "OptionalType", baseType };
}

export function promiseType(baseType) {
  return { kind: "PromiseType", baseType };
}

export function arrayType(baseType) {
  return { kind: "ArrayType", baseType };
}

// ***************** (NEW) ***************** //
export function dictionaryType(keyType, valueType) {
  return { kind: "DictionaryType", keyType, valueType };
}

export function iterableType(type) {
  return { kind: "IterableType", type };
}

export const boolType = { kind: "BoolType" };
export const intType = { kind: "IntType" };
export const floatType = { kind: "FloatType" };
export const stringType = { kind: "StringType" };
export const voidType = { kind: "VoidType" };
export const anyType = { kind: "AnyType" };

String.prototype.type = Type.STRING;
Number.prototype.type = Type.FLOAT;
BigInt.prototype.type = Type.INT;
Boolean.prototype.type = Type.BOOLEAN;

export const standardLibrary = Object.freeze({
  int: Type.INT,
  float: Type.FLOAT,
  bool: Type.BOOLEAN,
  str: Type.STRING,
  void: Type.VOID,
  any: Type.ANY,
  // π: new Variable("π", true, Type.FLOAT),
  // sin: new Function("sin", 1, true),
  // sqrt: new Function("sqrt", 1, true),
  // cos: new Function("cos", 1, true),
  // exp: new Function("exp", 1, true),
  // ln: new Function("ln", 1, true),
  // hypot: new Function("hypot", 2, true),
});

// carlos subscript a[1]
// index: [1]