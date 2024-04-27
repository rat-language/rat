import assert from "node:assert/strict";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
import optimize from "../src/optimizer.js";
import generate from "../src/generator.js";

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim();
}

const fixtures = [
  {
    name: "Simple program",
    source: `
        int i = 12;
        int j = 4;
        i = i + j;
        int k = 2 * j;
        
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
    name: "while false",
    source: `
        int i = 12;

        while (false) {
            bool j = true;
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
    name: "simple while loop",
    source: `
        int i = 12;

        while (i > 0) {
            i -= 1;
            if (i == 5) {
              break;
            }
          }
          
          `,
    expected: dedent`
          let i_1 = 12;
          while ((i_1 > 0)) {
            i_1 = (i_1 - 1);
            if ((i_1 === 5)) {
              break;
            }
          }
          `
  },

  {
    name: "Bool false return",
    source: `
        bool foo() {
          return false;
        }
        bool x = foo();
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
        int j = 12;
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
        int i = 12;
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
        `,
  },
  {
    name: "Indexing",
    // var y: int = x[0];
    source: `
    [int] x = [3, 10, 100];
    int y = x[0];
      `,
    // let y_2 = x_1[0];
    expected: dedent`
    let x_1 = [3,10,100];
    let y_2 = x_1[0];

      `,
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
      `,
  }, // kind field did not hit any generation, core --> calls are
  {
    name: "Print",
    source: `
      print(3);
      `,
    expected: dedent`
      console.log(3);
      `,
  },
  {
    name: "Call in Expression",
    source: `
      int y = 3;
      int sqr(x: int) {return (x * x);}
      int z = y + sqr(y);
    `,
    expected: dedent`
    let y_1 = 3;
    function sqr_2(x_3) {
      return (x_3 * x_3);
    }
    let z_4 = (y_1 + sqr_2(y_1));
    `,
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
      `,
  },
  {
    name: "for loop (collections)",
    source: `
      [int] nums = [1, 2, 3];
      for num in nums {
        print(num);
      }
      str msg = "goodbye";
      for letter in msg {
        print(letter);
      }
      `,
    expected: dedent`
      let nums_1 = [1,2,3];
      for (let num_2 of nums_1) {
        console.log(num_2);
      }
      let msg_3 = "goodbye";
      for (let letter_4 of msg_3) {
        console.log(letter_4);
      }
      `,
  },

  {
    name: "assign to array element",
    source: `
      [int] x = [1, 2, 3];
      x[0] = 4;
      `,
    expected: dedent`
      let x_1 = [1,2,3];
      x_1[0] = 4;
      `
  },

  {
    name: "Dictionaries",
    source: `
      {str: int} x = {"hi": 14, "lo": 2};
      `,
    expected: dedent`
      let x_1 = {"hi": 14, "lo": 2};
    
      `
  },
  {
    name: "empty array",
    source: `
      [int] x = [];
      `,
    expected: dedent`
      let x_1 = [];
      `
  },
  {
    name: "short if",
    source: `
      int x = 0;
      if (x == 0){
        print("hello world");
    }
    `,
    expected: dedent`
      let x_1 = 0;
      if ((x_1 === 0)) {
      console.log("hello world");
      }
      `
  },
  // test for this:   ["short return", "void foo() {\nreturn;\n}\nfoo();"],
  {
    name: "short return",
    source: `
      void foo() {
        print("hello");
        return;
      }
      foo();
      `,
    expected: dedent`
      function foo_1() {
        console.log("hello");
        return;
      }
      foo_1();
      `
  },
  // test for this:   ["try catch", "int foo() {\nreturn 10;\n}\ntry {\nvar r: int = foo();\n} catch(e:str) {\nprint(e);\n}"],
  {
    name: "try catch",
    source: `
      int foo() {
        return 10;
      }
      try {
        int r = foo();
      } catch(e:str) {
        print(e);
      }
      `,
    expected: dedent`
      function foo_1() {
        return 10;
      }
      try {
        let r_2 = foo_1();
      } catch (e_3) {
        console.log(e_3);
      }
      `
  },
  {
    name: "alternate assignment",
    source: `
        int i = 12;
        i += 12;
        `,
    expected: dedent`
        let i_1 = 12;
        i_1 = (i_1 + 12);
        `
  },
  
  {
    name: "iterable manipulation",
    source: `
        str x = "hello";
        [int] y = [1, 2, 3];
        {str: int} z = {"hi": 14, "lo": 2};
        print(#x);
        print(#y);
        print(#z);
        print(x[1]);
        print(y[1]);
        print(z["hi"]);

        `,
    expected: dedent`
        let x_1 = "hello";
        let y_2 = [1,2,3];
        let z_3 = {"hi": 14, "lo": 2};
        console.log(x_1.length);
        console.log(y_2.length);
        console.log(Object.keys(z_3).length);
        console.log(x_1[1]);
        console.log(y_2[1]);
        console.log(z_3["hi"]);
        `
  },
// Write tests for the following from the generator.js file:
// EmptyOptional(e) {
//   return "undefined";
// },

  {
    name: "Empty Optional",
    source: `
      str? x = no str;
      `,
    expected: dedent`
      let x_1 = undefined;
      `
  },
  {
    name: "Declarations",
    source: `
      int x = 12;
      float y = 3.14;
      str z = "hello";
      bool a = true;
      anything b = 12;
      int foo(x:int, y:float) { return 12; }
      [int] c = [1, 2, 3];
      {str: int} d = {"hi": 14, "lo": 2};
      `,
    expected: dedent`
      let x_1 = 12;
      let y_2 = 3.14;
      let z_3 = "hello";
      let a_4 = true;
      let b_5 = 12;
      function foo_6(x_7, y_8) {
        return 12;
      }
      let c_9 = [1,2,3];
      let d_10 = {"hi": 14, "lo": 2};
      `
  },


]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))));
      assert.deepEqual(actual, fixture.expected);
    });
  }
});
