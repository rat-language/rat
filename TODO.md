# TODO: by file

## analyzer.js:
- `LoopStmt_foreach`: Need to add handling for passing in a dictionary, so that the iterator is the dictionary key
- `function assignable(fromType, toType)`: 
  - find a way to test the "FunctionType" of this return statement (not being tested right now in `analyzer.test.js`)
  - `(fromType.keyBaseType === ANY && fromType.baseType === ANY)`: Test this part too
- Implement type checking for dictionary in the analyzer (current doing this in `core.js`)
- *Possibly take out Standard Library* : as cool as it would be, it may not be possible with our current ohm grammar, unless we add some more stuff and change out the typing...

## core.js
- `export function dictionaryLiteral`: remove the type checking from here, put it in analyzer.js
- fix up the way empty dictionaries are handled. 
  - **Question for Toal**: What is the advantage of having an emptyDictLiteral vs a DictionaryLiteral with an empty list? 
- *Possibly take out Standard Library*

## generator.js
- test `emptyOptional`

## optimizer.js:
- **A lot of stuff needs to be changed**. We're testing out optimizer stuff in the generator.test.js, but it should probably be getting tested in optimizer.js

## README.md
- We've made a lot of changes to our grammars, however, this README has some stuff that might still reflect this.

---

## Tips
**Getting Breakpoints to work in files down the structure of the codebase for node.js**
Breakpoints don't work for files not directly mentioned in the command line so `npm test test/analyzer.test.js` initially won't look at any breakpoints in the `analyzer.js` file if you're trying to debug
- CTRL+SHFT+P
  - Search: "Debug Toggle Auto Attach", click on it
  - set to 'smart'