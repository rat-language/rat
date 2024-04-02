import assert from "node:assert/strict"; 
import analyze from "../src/analyzer.js";
import parse from "../src/parser.js";

describe("The analyzer", () => {
  it("Analyzes a simple program", () => {
    const source = `var x:int = 12; print(2); print(x);`;
    const expected = {
      kind: "Program",
      statements: [
        {
          kind: "VariableDeclaration",
          variable: {
            kind: "Variable",
            name: "x",
            type: undefined,
          },
          initializer: 1,
        },
        {
          kind: "PrintStatement",
          expression: 2,
        },
        {
          kind: "PrintStatement",
          expression: {
            kind: "Variable",
            name: "x",
            type: undefined,
          }
        },
      ],
    }
    assert.deepEqual(analyze(parse(source)), expected)
  })
  it("throws an error for an undefined variable", () => {
    const source = `print(x);`;
    assert.throws(() => analyze(parse(source)), /Variable x not defined/)
  })

})
