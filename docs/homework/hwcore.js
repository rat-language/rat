//
// hwcore.js
//
// //contains the core elements of our interpreter
import * as ohm from "ohm-js";
import fs from 'fs';

// Load the Ohm grammar from a file or define it inline
// For example, a grammar for Canadian postal codes might look something like this:
const canadianPostalCodeGrammar = ohm.grammar(`
canadianPostalCode {
  program = postalCode
  postalCode = firstPart char " " digit char digit
  firstPart = ~"M0" char digit
  char = ~"D" ~"F" ~"I" ~"O" ~"Q" ~"U" upper
}
`);

// Similar grammar definitions for Visa, MasterCard, etc.
// For simplicity, we'll assume these are defined inline or loaded from files
const visaGrammar = ohm.grammar(`visa {
  program = visanum
  visanum = "4" fifteend --fifteen
     | "4" twelved --twelve
  twelved = digit digit digit digit digit digit digit digit digit digit digit digit
  fifteend = digit digit digit digit digit digit digit digit digit digit digit digit digit digit digit
}`);
const masterCardGrammar = ohm.grammar(`masterCard {
  program = mastercardnum
  mastercardnum = fiftys fourteend --fourteen
             | twothousands twelved --twelve
  fourteend = digit digit digit digit digit digit digit digit digit digit digit digit digit digit
  twelved = digit digit digit digit digit digit digit digit digit digit digit digit
  fiftys = "5" "1".."5"
  twothousands = "2" "2" "2" "1".."9"                 //2221-2229
              | "2" "2" "3".."9" digit     			//2230-2299
              | "2" "3".."6" digit digit   			//2300-2699
              | "2" "7" "0" "0".."9"          		//2700-2709
              | "2" "7" "1" "0".."9"         			//2710-2719
              | "2" "7" "2" "0"                       //2720
}
`);

const notThreeEndingGrammar = ohm.grammar(`
notThreeEndingInOO {
  Program = sequence
  sequence = ~notallowed letter*
  notallowed = letter allo allo ~any
  allo = "o"
  | "O"
}
`);
const divisibleBy16Grammar = ohm.grammar(`
divisibleBy16 {
  divisby16 = multiplebin "0" "0" "0" "0" "0"* --fourplus
  | "0" "0" "0" "0" --four
  | "0" "0" "0" --three
  | "0" "0" --two
  | "0" --one
  bin = "0001"
  | "0011"
  | "0101"
  | "0111"
  | "1001"
  | "1011"
  | "1101"
  | "1111"
  | "001"
  | "011"
  | "101"
  | "111"
  | "01"
  | "11"
  | "1"
  multiplebin = bin*
}
`);
const notPythonPycharmPycGrammar = ohm.grammar(`
NotPy {
  program = valid
  valid = ~notvalid any*
  notvalid = "py" ("charm"|"c"|"thon") end
}
`);

const eightThroughThirtyTwoGrammar = ohm.grammar(`
eightthruthirtytwo {
  program = range
  range = "8" end --eight
  | "9" end       --nine
  | "1" digit end --tenthroughnineteen
  | "2" digit end --twentythroughtwentynine
  | "3" "0" end   --thirty
  | "3" "1" end   --thirtytwo
  | "3" "2" end   --thirtythree
}
`);

const restrictedFloatsGrammar = ohm.grammar(`
restrictedFloats {
  program = float
  float = integer dec? exponent
  integer = digit+
  dec = "." digit*
  exponent = "e" sign? digit digit? digit?
  sign = "+" | "-"
}
`);
const palindromes2358Grammar = ohm.grammar(`
palindromes2358 {
  Palindrome  = pal8 | pal5 | pal3 | pal2 
  pal8 = "a" pal6 "a"
       | "b" pal6 "b"
       | "c" pal6 "c"
  pal6 = "a" pal4 "a"
       | "b" pal4 "b"
       | "c" pal4 "c"
  pal5 = "a" pal3 "a"
       | "b" pal3 "b"
       | "c" pal3 "c"
  pal4 = "a" paltwo "a"
       | "b" paltwo "b"
       | "c" paltwo "c"
  pal3 = "a" char? "a"
      | "b" char? "b"
       | "c" char? "c"
  pal2 = "a" "a" "a"?   --a
      | "b" "b" "b"?  --b
       | "c" "c" "c"?   --c
  paltwo = "a" "a" 
      | "b" "b" 
       | "c" "c"
  char = "a" | "b" | "c"
}
`)
const pythonStringLiteralsGrammar =ohm.grammar(`
PythonStringLit{
	Program = Stmt+
  Stmt = stringlit
  stringlit = stringprefix? (longstringlit | stringlitd | stringlits)
  stringprefix = "r" | "u" | "R" | "U" | "f" | "F"
               | "fr" | "Fr" | "fR" | "FR" | "rf" | "rF" | "Rf" | "RF"
  stringlits = "'" shortstrs* "'"
              |  "\"" shortstrd* "\""
  longstringlit = longstrlits | longstrlitd
  longstrlits = "'''" longstringitems* "'''"
  longstrlitd = "\"\"\"" longstringitemd* "\"\"\""
  // top level char
  char = "\\n" 			    --newlineescape
            |"\\t"
            |"\\\\"
  shortstrd = char
            | "\\\""						         --escape
            |~"\"" ~"\n" any		--regulard
  shortstrs = char
              | "\\'"
              |~"'" ~"\n" any		--regulars
  longstringitemd = longstringchard
  longstringitems = longstringchars
  longstringchars = char
                | "\\\'"
                | ~"'''" any 		--regular
  longstringchard = char
                | "\\\""
                | ~"\"\"\"" any 		--regular
}
`)
// Add more grammars as needed

// Organize the grammars in an object for easy access
const grammar = {
  canadianPostalCode: canadianPostalCodeGrammar,
  visa: visaGrammar,
  masterCard: masterCardGrammar,
  notThreeEndingInOO : notThreeEndingGrammar,
  divisibleBy16: divisibleBy16Grammar,
  notPythonPycharmPyc: notPythonPycharmPycGrammar,
  eightThroughThirtyTwo: eightThroughThirtyTwoGrammar,
  restrictedFloats: restrictedFloatsGrammar,
  palindromes2358: palindromes2358Grammar,
  pythonStringLiterals: pythonStringLiteralsGrammar,
};

// Export the grammar object for use in other modules
export { grammar };
