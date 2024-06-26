import assert from "node:assert/strict"
import parse from "../src/parser.js"

// FOR IDEAS ON WHAT TO ADD HERE, look at my experiments.rat file, those are almost all decent places to start for these kinds of tests
const syntaxChecks = [
  ["all numeric literal forms", "print(8 * 89.123);"],
  ["complex expressions", "print(83 * ((((-((((13 / 21)))))))) + 1 - 0);"],
  ["all unary operators", "print (-3); print (!false);"],
  ["all binary operators", "print (x && y || z * 1 / 2 ** 3 + 4 < 5);"],
  ["all arithmetic operators", "float x = (!3) * 2 + 4 - (-7.3) * 8 ** 13 / 1;"],
  ["all relational operators", "bool x  = 1<(2<=(3==(4!=(5 >= (6>7)))));"],
  ["all logical operators", "bool x = true && false || (!false);"],
  ["end of program inside comment", "print(0); // goober"],
  ["comments with no text are ok", "print(1);//\nprint(0);//"],
  ["non-Latin letters in identifiers", "コンパイラ = 100;"],
  ["dictionary printing", "print({\"AZ\": \"Phoenix\", \"FL\":\"Tallahassee\"});"],
  ["array indexing in place", "print(f(x)[1][5]);"],
  ["underscores in names", "float _grams = 2.01;"],
  ["coalescing operator", "str? boss = some \"Tina\";\nprint (boss ?? \"No boss here\");"],
  ["multiple function calls", "int f(x:anything) {return 12;}\nprint (f(\"dog\") + f(2));"],
  ["short return", "void foo() {\nreturn;\n}\nfoo();"],
  ["try catch", "int foo() {\nreturn 10;\n}\ntry {\nint r = foo();\n} catch(e:str) {\nprint(e);\n}"],
  ["dictionaries", `{str:int} d = {"a": 1, "b": 2};\nprint(d["a"]);`],
  ["anything type", `anything b = 1;\nprint(b);`],
]

// SYNTAX ERRORS NEED TO BE CHANGED EXTENSIVELY
// These will obviously not work as this is all syntax for a different language!
// we need to make some custom tests here for errors.
const syntaxErrors = [
  ["non-letter in an identifier", "int ab@c = 2;", /Line 1, col 7/],
  ["malformed number", "x = 2.;", /Line 1, col 7/],
  ["missing semicolon", "x = 3 y = 1;", /Line 1, col 7/],
  ["a missing right operand", "print(5 -", /Line 1, col 10/],
  ["a non-operator", "print(7 * ((2 _ 3)));", /Line 1, col 15/],
  ["an expression starting with a )", "x = );", /Line 1, col 5/],
  ["a statement starting with a )", "print(5);\n) * 5", /Line 2, col 1/],
  ["an expression starting with a *", "x = * 71;", /Line 1, col 5/],
  ["void variable", "void x = 5;", /Line 1, col 8/],
]

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`Accepts ${scenario}`, () => {
      assert(parse(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`Rejects ${scenario}`, () => {
      assert.throws(() => parse(source), errorMessagePattern)
    })
  }
})