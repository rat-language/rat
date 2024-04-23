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
          print(i);
          i += 1;
        }
        `,
        expected: dedent`
        let i = 0;
        while (i <= 10) {
          console.log(i);
          i += 1;
        }
        `
    },
    {
        name: "call",
        source: `
        int sqr(x: int) {return (x * x);}
        print(sqr(3) + 1);
        `,
        expected: dedent`
        function sqr(x) {
          return x * x;
        }
        console.log(sqr(3) + 1);
        `
    },
    {
        name: "for loop",
        source: `
        for j in 1...10 {
            print(j);
            if j > 8 {
              break;
            }
          }
        `,
        expected: dedent`
        for (let j = 1; j <= 10; j++) {
          console.log(j);
          if (j > 8) {
            break;
          }
        }
        `
    }
]