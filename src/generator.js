// TODO: Change from carlos to Rat

// The code generator exports a single function, generate(program), which
// accepts a program representation and returns the JavaScript translation
// as a string.

import { voidType, standardLibrary } from "./core.js";

export default function generate(program) {
  // When generating code for statements, we'll accumulate the lines of
  // the target code here. When we finish generating, we'll join the lines
  // with newlines and return the result.
  const output = [];

  const standardFunctions = new Map([
    [standardLibrary.print, (x) => `console.log(${x})`], // print is a statement, take a peek at Bella's language
    [standardLibrary.sin, (x) => `Math.sin(${x})`],
    [standardLibrary.cos, (x) => `Math.cos(${x})`],
    [standardLibrary.exp, (x) => `Math.exp(${x})`],
    [standardLibrary.ln, (x) => `Math.log(${x})`],
    [standardLibrary.hypot, ([x, y]) => `Math.hypot(${x},${y})`],
    [standardLibrary.bytes, (s) => `[...Buffer.from(${s}, "utf8")]`],
    [standardLibrary.codepoints, (s) => `[...(${s})].map(s=>s.codePointAt(0))`],
  ]);
  
  // Variable and function names in JS will be suffixed with _1, _2, _3,
  // etc. This is because "switch", for example, is a legal name in Carlos,
  // but not in JS. So, the Carlos variable "switch" must become something
  // like "switch_1". We handle this by mapping each name to its suffix.
  const targetName = ((mapping) => {
    return (entity) => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1);
      }
      return `${entity.name}_${mapping.get(entity)}`;
    };
  })(new Map());

  const gen = (node) => generators?.[node?.kind]?.(node) ?? node;

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      p.statements.forEach(gen);
    },

    VariableDeclaration(d) {
      // We don't care about const vs. let in the generated code! The analyzer has
      // already checked that we never updated a const, so let is always fine.
      output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`);
    },
    // TypeDeclaration(d) {
    //   // The only type declaration in Carlos is the struct! Becomes a JS class.
    //   output.push(`class ${gen(d.type)} {`)
    //   output.push(`constructor(${d.type.fields.map(gen).join(",")}) {`)
    //   for (let field of d.type.fields) {
    //     output.push(`this[${JSON.stringify(gen(field))}] = ${gen(field)};`)
    //   }
    //   output.push("}")
    //   output.push("}")
    // },
    // StructType(t) {
    //   return targetName(t)
    // },
    // Field(f) {
    //   return targetName(f)
    // },
    FunctionDeclaration(d) {
      output.push(`function ${gen(d.fun)}(${d.params.map(gen).join(", ")}) {`);
      d.body.forEach(gen);
      output.push("}");
    },
    Variable(v) {
      // Standard library constants just get special treatment
      if (v === standardLibrary.π) return "Math.PI";
      return targetName(v);
    },
    Function(f) {
      return targetName(f);
    },
    Assignment(s) {
      output.push(`${gen(s.target)} = ${gen(s.source)};`);
    },
    BreakStatement(s) {
      output.push("break;");
    },
    ReturnStatement(s) {
      output.push(`return ${gen(s.expression)};`);
    },
    ShortReturnStatement(s) {
      output.push("return;");
    },
    IfStatement(s) {
      output.push(`if (${gen(s.test)}) {`);
      s.consequent.forEach(gen);
      if (s.alternate?.kind?.endsWith?.("IfStatement")) {
        output.push("} else");
        gen(s.alternate);
      } else {
        output.push("} else {");
        s.alternate.forEach(gen);
        output.push("}");
      }
    },
    ShortIfStatement(s) {
      output.push(`if (${gen(s.test)}) {`);
      s.consequent.forEach(gen);
      output.push("}");
    },
    WhileStatement(s) {
      output.push(`while (${gen(s.test)}) {`);
      s.body.forEach(gen);
      output.push("}");
    },
    // RepeatStatement(s) {
    //   // JS can only repeat n times if you give it a counter variable!
    //   const i = targetName({ name: "i" });
    //   output.push(`for (let ${i} = 0; ${i} < ${gen(s.count)}; ${i}++) {`);
    //   s.body.forEach(gen);
    //   output.push("}");
    // },
    ForRangeStatement(s) {
      const i = targetName(s.iterator);
      const op = s.op === "..." ? "<=" : "<";
      output.push(
        `for (let ${i} = ${gen(s.low)}; ${i} ${op} ${gen(s.high)}; ${i}++) {`
      );
      s.body.forEach(gen);
      output.push("}");
    },
    ForStatement(s) {
      output.push(`for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`);
      s.body.forEach(gen);
      output.push("}");
    },
    // Conditional(e) {
    //   return `((${gen(e.test)}) ? (${gen(e.consequent)}) : (${gen(e.alternate)}))`
    // },
    BinaryExpression(e) {
      const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op;
      return `(${gen(e.left)} ${op} ${gen(e.right)})`;
    },
    UnaryExpression(e) {
      const operand = gen(e.operand);
      if (e.op === "some") {
        return operand;
      } else if (e.op === "#") {
        return `${operand}.length`;
      }
      return `${e.op}(${operand})`;
    },
    EmptyOptional(e) {
      return "undefined";
    },
    IndexExpression(e) {
      return `${gen(e.iterable)}[${gen(e.index)}]`;
    },
    ArrayLiteral(e) {
      return `[${e.elements.map(gen).join(",")}]`;
    },
    DictionaryLiteral(d) {
      //To demonstrate, let's say you have a dictionary declaration in your source language like:
      // var myDict = {"age": 25, "name": "John"};
      //let myDict = {age: 25, name: "John"};

      //... this could be a problem later on
      const entries = d.elements.map(({ key, value }) => `${gen(key)}: ${gen(value)}`);
      return `{${entries.join(", ")}}`;
    },
    DictionaryEntry(e) {
      // This might be called as part of DictionaryLiteral or other contexts where a key-value pair is needed
      return `${gen(e.key)}: ${gen(e.value)}`;
    },
    EmptyArray(e) {
      return "[]";
    },
    Call(c) {
      const targetCode = standardFunctions.has(c.callee)
        ? standardFunctions.get(c.callee)(c.args.map(gen))
        : `${gen(c.callee)}(${c.args.map(gen).join(", ")})`; // analyzing a statement, will become output.push... anything evaluating should be returned
      // Calls in expressions vs in statements are handled differently
      if (c.callee.type.returnType !== voidType) {
        return targetCode;
      }
      output.push(`${targetCode};`);
    },
    CallStatement(c) {
      if (c.call.callee.type.returnType === voidType) {
        return gen(c.call);
      }
      output.push(`${gen(c.call)};`);
    },

    // Try statement working, doesnt use finally clause. THIS IS MESSED UP
    TryStatement(t) {
      output.push("try {");
      t.body.forEach(gen);
      output.push(`} catch (${t.errors.map(gen).join(", ")}) {`);
      t.catchClause.forEach(gen);
      output.push("}");
    },

    PrintStatement(p) {
      // exact functionality represented in javascript code
      // gen on the p.argument to fully fill out the tree before printing
      output.push(`console.log(${gen(p.argument)});`);
    },
  };

  gen(program);
  return output.join("\n");
}
