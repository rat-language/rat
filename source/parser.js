/* 
Basis for code from: https://github.com/rtoal/bella/tree/main
*/
// PARSER
//
// The parse() function uses Ohm to produce a match object for a given
// source code program, using the grammar in the bella.ohm.
import * as fs from "fs";
import * as ohm from "ohm-js";

const grammar = ohm.grammar(fs.readFileSync("source/rat.ohm"))

// Returns the Ohm match if successful, otherwise throws an error
export default function parse(sourceCode) {
  const match = grammar.match(sourceCode)
  if (!match.succeeded()) throw new Error(match.message)
  return match
}