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
    }
]