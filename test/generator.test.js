import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
    return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
    {
        name: "while loop",
        source: `
        var i:int = 0;
        while (i <= 10){
          i += 1;
        }
        `,
        expected: dedent`
        let i_1 = 0;
        while (i_1 <= 10) {
          i += 1;
        }
        `
    },
    // {
    //     name: "call",
    //     source: `
    //     int sqr(x: int) {return (x * x);}
    //     print(sqr(3) + 1);
    //     `,
    //     expected: dedent`
    //     function sqr(x) {
    //       return x * x;
    //     }
    //     console.log(sqr(3) + 1);
    //     `
    // },
    // {
    //     name: "for loop",
    //     source: `
    //     for j in 1...10 {
    //         if j > 8 {
    //           break;
    //         }
    //       }
    //     `,
    //     expected: dedent`
    //     for (let j_1 = 1; j_1 <= 10; j_1++) {
    //       if (j_1 > 8) {
    //         break;
    //       }
    //     }
    //     `
    // }
]


describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})