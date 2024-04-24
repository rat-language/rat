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
        var i:int = 12;
        var j:int = 4;
        i = i + j;
        var k: int = 2 * j;
        
        int foo(x:int){
          return x * 2;
        }
        `,
    expected: dedent`
        let i_1 = 12;
        let j_2 = 4;
        i_1 = (i_1 + j_2);
        let k_3 = (2 * j_2);
        
        function foo_4(x_5) {
          return (x_5 * 2);
        }
        `
    },
  {
    name: "whilllle",
    source: `
        var i:int = 12;

        while (false) {
            var j: bool = true;
            i = i - 1;
            if (i == 5) {
              break;
            }
          }
          
          `,
          expected: dedent`
          let i_1 = 12;
        `
    },

    {
        name: "Bool false return",
        source: `
        bool foo() {
          return false;
        }
        var x: bool = foo();
        `,
        expected: dedent`
        function foo_1() {
          return false;
        }
        let x_2 = foo_1();
        `
      },
    {
        name: "Simple If statements",
        source: `
        var j:int = 12;
        if (j > 0) { 
          j = j + 1;
        }
        `,
        expected: dedent`
        let j_1 = 12;
        if ((j_1 > 0)) {
          j_1 = (j_1 + 1);
        }
        `
      },
      {
        name: "If statements",
        source: `
        var i:int = 12;
        if (i > 0) { 
          i = i + 1;
        } else if (i == 0) {
          i = i * 2;
        } else {
          i = i - 1;
        }
        `,
    expected: dedent`
        let i_1 = 12;
        if ((i_1 > 0)) {
          i_1 = (i_1 + 1);
        } else
        if ((i_1 === 0)) {
          i_1 = (i_1 * 2);
        } else {
          i_1 = (i_1 - 1);
        }
        `
  },
  {
    name: "Indexing",
    // var y: int = x[0];
    source: `
    var x: [int] = [3];
    var y: int = x[0];
      `,
      // let y_2 = x_1[0];
    expected: dedent`
    let x_1 = [3];
    let y_2 = x_1[0];

      `
    
  },
  {
    name: "Call",
    source: `
      int sqr(x: int) {return (x * x);}
      sqr(3);
      `,
    expected: dedent`
      function sqr_1(x_2) {
        return (x_2 * x_2);
      }
      sqr_1(3);
      `
  }, // kind field did not hit any generation, core --> calls are
  {
    name: "Print",
    source: `
      print(3);
      `,
    expected: dedent`
      console.log(3);
      `
  },
  {
    name: "Call in Expression",
    source: `
      var y: int = 3;
      int sqr(x: int) {return (x * x);}
      var z: int = y + sqr(y);
    `,
    expected: dedent `
    let y_1 = 3;
    function sqr_2(x_3) {
      return (x_3 * x_3);
    }
    let z_4 = (y_1 + sqr_2(y_1));
    `
  },
  {
      name: "for loop",
      source: `
      for j in 1...10 {
          if j > 8 {
            break;
          }
        }
      `,
      expected: dedent`
      for (let j_1 = 1; j_1 <= 10; j_1++) {
        if ((j_1 > 8)) {
          break;
        }
      }
      `
  }
]


describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})