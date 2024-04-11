## analyzer.js/core.js:
- Need to add 'try' statements
- Need to add tests for 'dictionary' types, 
- Need to add tests for identifying type conversions
- Fix up the 'shortReturn' statements.

## analyzer.test.js:
- Add more unit tests for the above (e.g. try, dictionary, etc.) 

## parser.test.js:
- Add more examples for more robust parsing tests
  - we only have 25 unit tests and we've changed the grammar quite a bit since we've written these.  


# NOTES:
**Getting Breakpoints to work in files down the structure of the codebase for node.js**
Breakpoints don't work for files not directly mentioned in the command line so `npm test test/analyzer.test.js` initially won't look at any breakpoints in the `analyzer.js` file if you're trying to debug
- CTRL+SHFT+P
  - Search: "Debug Toggle Auto Attach", click on it
  - set to 'smart'
