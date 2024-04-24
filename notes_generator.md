# Notes on the generator
What's working:
- variable declarations are doing okay


What's not working:  
- print statement
- assignment statements (maybe because of our special operator???)

- Math stuff:
```rat
var x: int = 6 * 2;
```

should give back:

```js
let x_1 = 12;
```

but instead gives

```js
let x_1 = (6 * 2);
```





checklist:
[] print statements
  - `print` from rat should return `console.log` in js, it doesn't return anything right now
[x] variable declarations
[] function declarations
[] 