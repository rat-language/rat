/* 
Basis for code from: https://github.com/rtoal/bella/tree/main
*/
import assert from "node:assert/strict"
import compile from "../src/compiler.js"
// import { Program } from "../src/core.js"

const sampleProgram = "print(0);"

describe("The compiler", () => {
  it("throws when the output type is missing", done => {
    assert.throws(() => compile(sampleProgram), /Unknown output type/)
    done()
  })
  it("throws when the output type is unknown", done => {
    assert.throws(() => compile(sampleProgram, "no such type"), /Unknown output type/)
    done()
  })
  it("accepts the parsed option", done => {
    const compiled = compile(sampleProgram, "parsed")
    assert(compiled.startsWith("Syntax is ok"))
    done()
  })
})