/* 
Basis for code from: https://github.com/rtoal/bella/tree/main
*/
import parse from "./parser.js"
import analyze from "./analyzer.js"
import optimize from "./optimizer.js"
import generate from "./generator.js"
/******
 * Allows us to compile our file, but allows us to check in on the different steps involved in compilation 
 * 
 * [parser] -> [analyzer] -> [optimizer] -> [generator]
 *****/

export default function compile(source, outputType) {
  

  if (!["parsed", "analyzed", "optimized", "js"].includes(outputType)) {
    throw new Error("Unknown output type")
  }
  const match = parse(source)
  if (outputType === "parsed") return "Syntax is ok"
  const analyzed = analyze(match)
  if (outputType === "analyzed") return analyzed
  const optimized = optimize(analyzed)
  if (outputType === "optimized") return optimized
  return generate(optimized)
  // Alternate sequence we could do, if we simply wanted to compile the code
  // const match = parse(sourceCode);
  // const ir = analyze(match);
  // const optimized = optimize(ir);
  // return generate(optimized);
}