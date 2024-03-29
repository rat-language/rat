import * as fs from "node:fs/promises"
import process from "node:process"
import compile from "./compiler.js"

const help = `rat compiler

Syntax: rat <filename> <outputType>
d
Prints to stdout according to <outputType>, which must be one of:

  parsed     a message that the program was matched ok by the grammar
  analyzed   the statically analyzed representation
  optimized  the optimized semantically analyzed representation
  js         the translation to JavaScript
`

async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename)
    const compiled = compile(buffer.toString(), outputType)
    console.log(compiled)
  } catch (e) {
    console.error(`\u001b[31m${e}\u001b[39m`)
    process.exitCode = 1
  }
}

if (process.argv.length !== 4) {
  console.log(help)
} else {
  // !!! NOTE: TO TEST THIS CODE, ENTER INTO COMMAND LINE: 
  //    node src/rat.js helloWord.rat parsed
  // FILES BEING PASSED IN: 
  //       process.argv[2] = helloWorld.rate, process.argv[3] = parsed
  compileFromFile(process.argv[2], process.argv[3])
}