# Syntax
- **Syntax Error**: This error occurs when the code violates the rules of the programming language's syntax, meaning the structure or format of the code is incorrect. For example, missing a semicolon at the end of a statement in languages where it's required.

- **Semantic Error**: While the code might be syntactically correct, a semantic error occurs when it doesn't do what it's supposed to do according to its intended logic or meaning. For example, using a variable that hasn't been initialized, leading to undefined behavior, or incorrectly using an operator.

- **Not a Compile Time Error**: This refers to errors that occur during the runtime of a program, not during the compilation phase. Compile time errors include syntax and some types of semantic errors that can be detected before running the program. Runtime errors, in contrast, occur while the program is running, such as attempting to access an array out of its bounds or division by zero.



From the point of view of when errors are detected, we distinguish: 
#### Compile time errors: 
syntax errors and static semantic errors indicated by the compiler. 
#### Runtime errors: 
dynamic semantic errors, and logical errors, that cannot be detected by the compiler (debugging).
# Homework 3


---

## 1
### a
```java
x+++-y
```
**Not a compile time error**

### b
```java
x---+y
```
**Not a compile time error**

### c
"incrementing a read only variable"
**static semantic error**

### d
code in class C accessing a private field from class D
**static semantic error**

### e
Using an uninitialized variable
**static semantic error**

### f
Dereferencing a null reference
**runtime error - not a compile time error**

### g
null instanceof C
**not a compile time error**

### h
!!x
**not a compile type error**

### i
x > y > z
**semantic error**

### j
if (a instanceof Dog d) {...}
**not a compile time**

### k
var s = """This is weird""";
**syntax error**

### l
switch = 200;
**syntax error**


### m
x = switch (e) {case 1->5; default->8;};

**not a compile time error**



```js
export function program(statements) {
  return { kind: "Program", statements }
}

export function variableDeclaration(variable, initializer) {
  return { kind: "VariableDeclaration", variable, initializer }
}

export function functionDeclaration(fun, params, body) {
  return { kind: "FunctionDeclaration", fun, params, body }
}

export function assignment(target, source) {
  return { kind: "Assignment", target, source }
}

export function whileStatement(test, body) {
  return { kind: "WhileStatement", test, body }
}

export function printStatement(argument) {
  return { kind: "PrintStatement", argument }
}

export function call(callee, args) {
  return { kind: "Call", callee, args }
}

export function conditional(test, consequent, alternate) {
  return { kind: "Conditional", test, consequent, alternate }
}

export function binary(op, left, right) {
  return { kind: "BinaryExpression", op, left, right }
}

export function unary(op, operand) {
  return { kind: "UnaryExpression", op, operand }
}

export function variable(name, readOnly) {
  return { kind: "Variable", name, readOnly }
}

export function fun(name, paramCount) {
  return { kind: "Function", name, paramCount }
}

export const standardLibrary = Object.freeze({
  π: variable("π", true),
  sqrt: fun("sqrt", 1),
  sin: fun("sin", 1),
  cos: fun("cos", 1),
  exp: fun("exp", 1),
  ln: fun("ln", 1),
  hypot: fun("hypot", 2),
})
```