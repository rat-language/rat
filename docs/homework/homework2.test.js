import assert from "assert"
// import { matches } from "../ohm_exercises.js"
import { matches } from "./ohm_exercises.js"

const testFixture = {
  canadianPostalCode: {
    good: ["A7X 2P8", "P8E 4R2", "K1V 9P2", "Y3J 5C0"],
    bad: ["A7X   9B2", "C7E9U2", "", "Dog", "K1V\t9P2", " A7X 2P8", "A7X 2P8 "],
  },
  visa: {
    good: ["4128976567772613", "4089655522138888", "4098562516243"],
    bad: [
      "43333",
      "42346238746283746823",
      "7687777777263211",
      "foo",
      "π",
      "4128976567772613 ",
    ],
  },
  masterCard: {
    good: [
      "5100000000000000",
      "5294837679998888",
      "5309888182838282",
      "5599999999999999",
      "2221000000000000",
      "2720999999999999",
      "2578930481258783",
      "2230000000000000",
    ],
    bad: [
      "5763777373890002",
      "513988843211541",
      "51398884321108541",
      "",
      "OH",
      "5432333xxxxxxxxx",
    ],
  },
  notThreeEndingInOO: {
    good: ["", "fog", "Tho", "one", "a", "ab", "food"],
    bad: ["fOo", "gOO", "HoO", "zoo", "MOO", "123", "A15"],
  },
  divisibleBy16: {
    good: ["0", "00", "000", "00000", "00000", "000000", "00000000", "1101000000"],
    bad: ["1", "00000000100", "1000000001", "dog0000000"],
  },
  // eightThroughThirtyTwo: {
  //   good: Array(25)
  //     .fill(0)
  //     .map((x, i) => i + 8),
  //   bad: ["1", "0", "00003", "dog", "", "361", "90", "7", "-11"],
  // },
  notPythonPycharmPyc: {
    good: ["", "pythons", "pycs", "PYC", "apycharm", "zpyc", "dog", "pythonpyc"],
    bad: ["python", "pycharm", "pyc"],
  },
  // restrictedFloats: {
  //   good: ["1e0", "235e9", "1.0e1", "1.0e+122", "55e20"],
  //   bad: ["3.5E9999", "2.355e-9991", "1e2210"],
  // },
  // palindromes2358: {
  //   good: [
  //     "aa",
  //     "bb",
  //     "cc",
  //     "aaa",
  //     "aba",
  //     "aca",
  //     "bab",
  //     "bbb",
  //     "ababa",
  //     "abcba",
  //     "aaaaaaaa",
  //     "abaaaaba",
  //     "cbcbbcbc",
  //   ],
  //   bad: ["", "a", "ab", "abc", "abbbb", "cbcbcbcb"],
  // },
}

for (let name of Object.keys(testFixture)) {
  describe(`when matching ${name}`, () => {
    for (let s of testFixture[name].good) {
      it(`accepts ${s}`, () => {
        assert.ok(matches(name, s))
      })
    }
    for (let s of testFixture[name].bad) {
      it(`rejects ${s}`, () => {
        assert.ok(!matches(name, s))
      })
    }
  })
}
