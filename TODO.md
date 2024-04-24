## analyzer.js/core.js:
### more important
- Need to add 'try' statements
- Need to add 'dictionary' types, 
- Need to add type conversions
- appropriate changes to `ArrayLit_array`, `mustAllHaveSameType`, and possibly even `equivalence`:
  - The main idea:  if we have an array of all the same type, it will be statically typed to that
  - If there are mixed types or no types in that array, set it to an array of `[any]`.

- Need to fix up the 'Empty' values:
  - Empty Array in Carlos: ```[Type]()```
  - Empty Array in Rat: ```[]```
    - The advantage in carlos is that it shows the type there
  - The same applies to our dictionaries

- arrays are still screwy as this is passing the analyzer test:
```
var x: [int] = ["12", "13"]; print(x[0]);
```

- this is phony baloney:
```
function mustHaveCorrectTypeOnLHS(e, type, at)
```

### less important
- thinking of changing the error message for the for loop over the collections, this is within the `mustHaveIterableType`

## analyzer.test.js:
- Add more unit tests for the above (e.g. try, dictionary, etc.) 

## parser.test.js:
- Add more examples for more robust parsing tests
  - we only have 25 unit tests and we've changed the grammar quite a bit since we've written these. 

## README.md
- We've made a lot of changes to our grammars, however, this README is still reflecting the old grammar of the language


# NOTES:
**Getting Breakpoints to work in files down the structure of the codebase for node.js**
Breakpoints don't work for files not directly mentioned in the command line so `npm test test/analyzer.test.js` initially won't look at any breakpoints in the `analyzer.js` file if you're trying to debug
- CTRL+SHFT+P
  - Search: "Debug Toggle Auto Attach", click on it
  - set to 'smart'


## Questions for Toal: 
In our `FuncDecl`, what is the advantage of one statement over the other when handling/identifying the return type?:
```js
const returnType = type.children?.[0]?.rep() ?? VOID;
// versus
const returnType = type.rep() ?? VOID;
```


## Tips
check the core if issues with generator, ensure javascript output is stated as we want exactly

statement that the expression belongs to, has to be traced all the way through

exact functionality represented in javascript code
gen on the p.argument to fully fill out the tree before printing