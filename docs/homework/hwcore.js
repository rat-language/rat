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
  postalCode = firstPart char " " secondPart
  secondPart = digit char digit
  firstPart = ~"M0" char digit 

  char = "A" | "B" | "C" | "E" | "G" | "H" | "J" | "K" | "L" | "M" | "N" | "P" | "R" | "S" | "T" | "V" | "X" | "Y"
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
  fourteend = twelved digit digit
  twelved = digit digit digit digit digit digit digit digit digit digit digit digit
  fiftys = "5" "1".."5"
  twothousands = "222" "1".."9"                 //2221-2229
              | "223".."9" digit     			//2230-2299
              | "2" "3".."6" digit digit   			//2300-2699
              | "270" digit          		//2700-2709
              | "271" digit         			//2710-2719
              | "2720"                       //2720
}
`);

const notThreeEndingGrammar = ohm.grammar(`
notThreeEndingInOO {
  program = validstring
  validstring = ~badsequence any+
  badsequence = any badletters ~any
  badletters = "oo" | "oO" | "Oo" | "OO"
}
`);
const divisibleBy16Grammar = ohm.grammar(`
divisibleBy16 {
  divisby16 = multiplebin "0" "0" "0" "0" "0"* --fourplus
  | "0000" --four
  | "000" --three
  | "00" --two
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
notPythonPycharmPyc {
	goodvalues = ~badvalues any*
  badvalues = "python" ~any | "pycharm" ~any | "pyc" ~any
}
`);

// Add more grammars as needed

// Organize the grammars in an object for easy access
const grammar = {
  canadianPostalCode: canadianPostalCodeGrammar,
  visa: visaGrammar,
  masterCard: masterCardGrammar,
  notThreeEndingInOO : notThreeEndingGrammar,
  divisibleBy16: divisibleBy16Grammar,
  notPythonPycharmPyc: notPythonPycharmPycGrammar, 
  // Add other grammars here
};

// Export the grammar object for use in other modules
export { grammar };
