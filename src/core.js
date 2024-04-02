
export function program(statements) {
  return { kind: "Program", statements }
}

//==================== (VALID STATEMENTS) ====================//
export function printStatement(argument) {
  return { kind: "PrintStatement", argument }
}

export function variableDeclaration(variable, initializer) {
  return { kind: "VariableDeclaration", variable, initializer }
}

export function constantDeclaration(variable, initializer) {
  // temporary
  return { kind: "ConstantDeclaration", variable, initializer }
}

// Must be changed 
export function assignment(target, source) {
  return { kind: "Assignment", target, source }
}

// NOTE: This can stay the same
export function whileStatement(test, body) {
  return { kind: "WhileStatement", test, body }
}

// ***************** (NEW) ***************** //
// export function forRangeStatement(iterator, low, op, high, body) {
//   return { kind: "ForRangeStatement", iterator, low, op, high, body }
// }

export function forStatement(init, test, update, body) {
  return { kind: "WhileStatement", test, body }
}

// NOTE: This can stay the same
export function call(callee, args) {
  return { kind: "Call", callee, args }
}

// Note: This can stay the same
export function conditional(test, consequent, alternate) {
  return { kind: "Conditional", test, consequent, alternate }
}

export function passStatement() {}

export function breakStatement() {}

export function returnStatement(expression) {
  return { kind: "ReturnStatement", expression }
}

// ***************** (NEW) ***************** //
export function tryStatement(body, catchClause, finallyClause) {
  return { kind: "TryStatement", body, catchClause, finallyClause }
}

// Must be changed 
export function functionDeclaration(fun, params, body) {
  return { kind: "FunctionDeclaration", fun, params, body }
}

// ***************** (NEW) ***************** //
export function importStatement() {}

// ***************** (NEW) ***************** //
export function importFromStatement() {}


//==========================( EXPRESSIONS )================================//


export function binary(op, left, right) {
  return { kind: "BinaryExpression", op, left, right }
}

export function unary(op, operand) {
  return { kind: "UnaryExpression", op, operand }
}

//-------------------- (TYPES) --------------------//
export function optionalType(baseType) {
  return { kind: "OptionalType", baseType }
}

export function arrayType(baseType) {
  return { kind: "ArrayType", baseType }
}


export function variable(name, readOnly) {
  return { kind: "Variable", name, readOnly }
}

export function fun(name, paramCount) {
  return { kind: "Function", name, paramCount }
}

export function iterable(type) {
  return { kind: "Iterable", type }
}



export const standardLibrary = Object.freeze({
  int: Type.INT,
  float: Type.FLOAT,
  bool: Type.BOOLEAN,
  str: Type.STRING,
  void: Type.VOID,
  any: Type.ANY,
  π: new Variable("π", true, Type.FLOAT),
  sin: new Function("sin", 1, true),
  sqrt: new Function("sqrt", 1, true),
  cos: new Function("cos", 1, true),
  exp: new Function("exp", 1, true),
  ln: new Function("ln", 1, true),
  hypot: new Function("hypot", 2, true),
})

String.prototype.type = Type.STRING
Number.prototype.type = Type.FLOAT
BigInt.prototype.type = Type.INT
Boolean.prototype.type = Type.BOOLEAN


export class Type {
  // Type of all basic type int, float, string, etc. and superclass of others
  static BOOLEAN = new Type("bool")
  static INT = new Type("int")
  static FLOAT = new Type("float")
  static STRING = new Type("str")
  static VOID = new Type("void")
  static ANY = new Type("any")
  constructor(description) {
    // The description is a convenient way to view the type. For basic
    // types or structs, it will just be the names. For arrays, you will
    // see "[T]". For optionals, "T?". For functions "(T1,...Tn)->T0".
    Object.assign(this, { description })
  }
}


// Program.prototype[util.inspect.custom] = function () {
//   const tags = new Map()

//   // Attach a unique integer tag to every node
//   function tag(node) {
//     if (tags.has(node) || typeof node !== "object" || node === null) return
//     if (node.constructor === Token) {
//       // Tokens are not tagged themselves, but their values might be
//       tag(node?.value)
//     } else {
//       // Non-tokens are tagged
//       tags.set(node, tags.size + 1)
//       for (const child of Object.values(node)) {
//         Array.isArray(child) ? child.forEach(tag) : tag(child)
//       }
//     }
//   }

//   function* lines() {
//     function view(e) {
//       if (tags.has(e)) return `#${tags.get(e)}`
//       if (e?.constructor === Token) {
//         return `(${e.category},"${e.lexeme}"${
//           e.value ? "," + view(e.value) : ""
//         })`
//       }
//       if (Array.isArray(e)) return `[${e.map(view)}]`
//       return util.inspect(e)
//     }
//     for (let [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
//       let type = node.constructor.name
//       let props = Object.entries(node).map(([k, v]) => `${k}=${view(v)}`)
//       yield `${String(id).padStart(4, " ")} | ${type} ${props.join(" ")}`
//     }
//   }

//   tag(this)
//   return [...lines()].join("\n")
// }