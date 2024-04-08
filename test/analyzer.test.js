import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import { program, variableDeclaration, variable, binary, floatType } from "../src/core.js"

// Programs that are semantically correct
const semanticChecks = [
  //------------( WORKING )-----------------//
  ["variable declarations", 'const x:int = 1; var y: bool = false;'],
  ["increment and decrement", "var x: int = 10; x -= 1; x += 1;"],
  ["??", "print(some 5 ?? 0);"],
  ["nested ??", "print(some 5 ?? 8 ?? 0);"],
  ["relations", 'print( 1 <= 2 && "x" > "y" && 3.5 < 1.2);'],
  ["long if", "if true {print(1);} else {print(3);}"],
  ["else if", "var x: int = 2; if x == 3 { print (true); } else if x <= 3 {pass;}"],
  ["initialize with empty array", "var a:[int] = [];"],
  ["assign arrays", "var a : [int] = []; var b : [int] =[1]; a = b; b = a;"],
  ["assign to array element", "var a: [int] = [1,2,3]; a[1] = 100;"],
  ["assign optionals", "var a: int? = None;"],
  ["initialize with empty optional", "var a: int? = None;"],
  ["assign optionals", "var a: int? = None; a = some 100;"],
  ["for exclusive", "for j in 1..<10 {print(j);}"],
  ["for inclusive", "for i in 1...10 {print(i);}"],
  ["||", "print(true || 1<2 || false || !true);"],
  ["&&", "print(true && 1<2 && false && !true);"],
  
  
  //------------( NOT WORKING )-----------------//
  // ["complex array types", "void f(x: [[[int?]]?]) {}"],
  // ["return statement", "bool f() { return true; }"],
  // ["break in nested if", "while false {if true {break;}}"],
  // ["for over collection", "for i in [2,3,5] {print(1);}"],
  // ["ok to == arrays", "print([1]==[5,8]);"],
  // ["ok to != arrays", "print([1]!=[5,8]);"],
  // ["assigned functions", "void f() {}\nlet g = f;g = f;"],
  // ["return in nested if", "bool f() {if true {return false;}}"],
  
  
  //------------( STILL IN CARLOS )-----------------//
  // // ["shifts", "print(1<<3<<5<<8>>2>>0);"],
  // // ["arithmetic", "let x=1;print(2*3+5**-3/2-5%8);"],
  // // ["array length", "print(#[1,2,3]);"],
  // // ["optional types", "let x = no int; x = some 100;"],
  // // ["random with array literals, ints", "print(random [1,2,3]);"],
  // // ["random with array literals, strings", 'print(random ["a", "b"]);'],
  // // ["random on array variables", "let a=[true, false];print(random a);"],
  // // ["variables", "let x=[[[[1]]]]; print(x[0][0][0][0]+2);"],
  // // ["nested structs", "struct T{y:int} struct S{z: T} let x=S(T(1)); print(x.z.y);"],
  // // ["subscript exp", "let a=[1,2];print(a[0]);"],
  // // ["call of assigned functions", "function f(x: int) {}\nlet g=f;g(1);"],
  // // ["type equivalence of nested arrays", "function f(x: [[int]]) {} print(f([[1],[2]]));"],
  // // [
    // //   "call of assigned function in expression",
    // //   `function f(x: int, y: boolean): int {}
    // //   let g = f;
    // //   print(g(1, true));
    // //   f = g; // Type check here`,
    // // ],
    // // [
  // //   "pass a function to a function",
  // //   `function f(x: int, y: (boolean)->void): int { return 1; }
  // //    function g(z: boolean) {}
  // //    f(2, g);`,
  // // ],
  // // [
    // //   "function return types",
    // //   `function square(x: int): int { return x * x; }
  // //    function compose(): (int)->int { return square; }`,
  // // ],
  // // ["function assign", "function f() {} let g = f; let h = [g, f]; print(h[0]());"],
  // // ["struct parameters", "struct S {} function f(x: S) {}"],
  // // ["array parameters", "function f(x: [int?]) {}"],
  // // ["optional parameters", "function f(x: [int], y: string?) {}"],
  // // ["empty optional types", "print(no [int]); print(no string);"],
  // // ["types in function type", "function f(g: (int?, float)->string) {}"],
  // // ["voids in fn type", "function f(g: (void)->void) {}"],
  // // ["outer variable", "let x=1; while(false) {print(x);}"],
  // // ["built-in constants", "print(25.0 * π);"],
  // // ["built-in sin", "print(sin(π));"],
  // // ["built-in cos", "print(cos(93.999));"],
  // // ["built-in hypot", "print(hypot(-4.0, 3.00001));"],
  
  // ------------( not even in our language lmao sam )-----------------//
  // ["conditionals with ints", "print(true ? 8 : 5);"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  //------------( WORKING )-----------------//
  ["undeclared id", "var a: int = 1; print(x);", /Identifier x not declared/],
  ["redeclared id", "var x:int = 1; var x:int = 1;", /Identifier x already declared/],
  ["assign to const", "const x : int = 1; x = 2;", /x is read only/],
  ["assign bad type", "var x: bool = true;var y: int = 1;print(x*y);", /Expected a number/],

  //------------( NOT WORKING )-----------------//
  // ["assign bad array type", "var x: int = 1;x=[true];", /Cannot assign a \[int\] to a boolean/],
  // ["assign bad optional type", "var x: int = 1;x=some 2;", /Cannot assign a int\? to a int/],
  // ["break outside loop", "break;", /Break can only appear in a loop/],


  //------------( STILL IN CARLOS )-----------------//
  // // [
  // //   "break inside function",
  // //   "while true {function f() {break;}}",
  // //   /Break can only appear in a loop/,
  // // ],
  // // ["return outside function", "return;", /Return can only appear in a function/],
  // // [
  // //   "return value from void function",
  // //   "function f() {return 1;}",
  // //   /Cannot return a value/,
  // // ],
  // // ["return nothing from non-void", "function f(): int {return;}", /should be returned/],
  // // ["return type mismatch", "function f(): int {return false;}", /boolean to a int/],
  // // ["non-boolean short if test", "if 1 {}", /Expected a boolean/],
  // // ["non-boolean if test", "if 1 {} else {}", /Expected a boolean/],
  // // ["non-boolean while test", "while 1 {}", /Expected a boolean/],
  // // ["non-integer repeat", 'repeat "1" {}', /Expected an integer/],
  // ["non-integer low range", "for i in true...2 ", /Expected an integer in range min/],
  // ["non-integer high range", "for i in 1..<false {}", /Expected an integer in range max/],
  ["unwrap non-optional", "print(1??2);", /Expected an optional/],
  // ["bad types for ||", "print(false||1);", /Expected a boolean/],
  // ["bad types for &&", "print(false&&1);", /Expected a boolean/],
  // ["bad types for ==", "print(false==1);", /Operands do not have the same type/],
  // ["bad types for !=", "print(false==1);", /Operands do not have the same type/],
  // ["bad types for +", "print(false+1);", /Expected a number or string/],
  // ["bad types for -", "print(false-1);", /Expected a number/],
  // ["bad types for *", "print(false*1);", /Expected a number/],
  // ["bad types for /", "print(false/1);", /Expected a number/],
  // ["bad types for **", "print(false**1);", /Expected a number/],
  // ["bad types for <", "print(false<1);", /Expected a number or string/],
  // ["bad types for <=", "print(false<=1);", /Expected a number or string/],
  // ["bad types for >", "print(false>1);", /Expected a number or string/],
  // ["bad types for >=", "print(false>=1);", /Expected a number or string/],
  // ["bad types for ==", "print(2==2.0);", /not have the same type/],
  // ["bad types for !=", "print(false!=1);", /not have the same type/],
  // ["bad types for negation", "print(-true);", /Expected a number/],
  // ["bad types for length", "print(#false);", /Expected an array/],
  // ["bad types for not", 'print(!"hello");', /Expected a boolean/],
  // ["bad types for random", "print(random 3);", /Expected an array/],
  // ["non-integer index", "var a: [int] = [];print(a[false]);", /Expected an integer/],
  // // ["no such field", "struct S{} let x=S(); print(x.y);", /No such field/],
  // // ["diff type array elements", "print([3,3.0]);", /Not all elements have the same type/],
  // // ["shadowing", "let x = 1;\nwhile true {let x = 1;}", /Identifier x already declared/],
  // // ["call of uncallable", "let x = 1;\nprint(x());", /Call of non-function/],
  // // [
  // //   "Too many args",
  // //   "function f(x: int) {}\nf(1,2);",
  // //   /1 argument\(s\) required but 2 passed/,
  // // ],
  // // [
  // //   "Too few args",
  // //   "function f(x: int) {}\nf();",
  // //   /1 argument\(s\) required but 0 passed/,
  // // ],
  // // [
  // //   "Parameter type mismatch",
  // //   "function f(x: int) {}\nf(false);",
  // //   /Cannot assign a boolean to a int/,
  // // ],
  // // [
  // //   "function type mismatch",
  // //   `function f(x: int, y: (boolean)->void): int { return 1; }
  // //    function g(z: boolean): int { return 5; }
  // //    f(2, g);`,
  // //   /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
  // // ],
  // // ["bad param type in fn assign", "function f(x: int) {} function g(y: float) {} f = g;"],
  // // [
  // //   "bad return type in fn assign",
  // //   'function f(x: int): int {return 1;} function g(y: int): string {return "uh-oh";} f = g;',
  // //   /Cannot assign a \(int\)->string to a \(int\)->int/,
  // // ],
  // // ["bad call to sin()", "print(sin(true));", /Cannot assign a boolean to a float/],
  // // ["Non-type in param", "let x=1;function f(y:x){}", /Type expected/],
  // // ["Non-type in return type", "let x=1;function f():x{return 1;}", /Type expected/],
  // // ["Non-type in field type", "let x=1;struct S {y:x}", /Type expected/],
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
  // it("produces the expected representation for a trivial program", () => {
  //   assert.deepEqual(
  //     analyze(parse("let x = π + 2.2;")),
  //     program([
  //       variableDeclaration(
  //         variable("x", false, floatType),
  //         binary("+", variable("π", true, floatType), 2.2, floatType)
  //       ),
  //     ])
  //   )
  // })
})
