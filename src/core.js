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

export function variable(name, readOnly, type) {
  return { kind: "Variable", name, readOnly, type };
}

// FunDecl
export function functionDeclaration(fun, params, body) {
  return { kind: "FunctionDeclaration", fun, params, body };
}

export function fun(name, paramCount) {
  return { kind: "Function", name, paramCount };
}

// Stmt_assign
export function assignment(target, source) {
  return { kind: "Assignment", target, source };
}

// LoopStmt
export function whileStatement(test, body) {
  return { kind: "WhileStatement", test, body };
}

export function forRangeStatement(iterator, low, op, high, body) {
  return { kind: "ForRangeStatement", iterator, low, op, high, body }
}

export function forStatement(iterator, collection, body) {
  return { kind: "ForStatement", iterator, collection, body }
}


export function callStatement(call) {
  return { kind: "CallStatement", call };
}

export function call(callee, args) {
  // This can appear within a CallStatement or as a primary expression
  return { kind: "Call", callee, args };
}

//IfStmt
export function shortIfStatement(test, consequent) {
  return { kind: "ShortIfStatement", test, consequent };
}

export function ifStatement(test, consequent, alternate) {
  return { kind: "IfStatement", test, consequent, alternate };
}

export function passStatement(_pass, _semicolon) { 
  return { kind: "PassStatement" }; 
}

export const breakStatement = { kind: "BreakStatement" }

export function returnStatement(expression) {
  return { kind: "ReturnStatement", expression };
}

export function tryStatement(body, catchClause, finallyClause) {
  return { kind: "TryStatement", body, catchClause, finallyClause };
}


//==========================( EXPRESSIONS )================================//
export function binary(op, left, right, type) {
  return { kind: "BinaryExpression", op, left, right, type };
}

export function unary(op, operand, type) {
  return { kind: "UnaryExpression", op, operand, type};
}

export function index(array, index) {
  return { kind: "IndexExpression", array, index, type: array.type.baseType };
}

//------------------------------- (TYPES) ---------------------------------//
export function functionType(paramTypes, returnType) {
  return { kind: "FunctionType", paramTypes, returnType }
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

export function dictionaryType(keyType, valueType) {
  return { kind: "DictionaryType", keyType, valueType };
}

export function arrayLiteral(elements) {
  return { kind: "ArrayLiteral", elements, type: arrayType(elements[0].type) };
}

export function emptyArrayLiteral() {
  return { kind: "EmptyArray" }
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