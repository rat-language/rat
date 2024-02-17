![alt text](/docs/rat.png)

# RAT
**Authors**: Alex Alvarez, Riley Kehoe, Chris Beaudoin, Sam Prosser, Carter Esparza

## Language Specification

### 1 Introduction
Our intentions with the project were to combine the simplified syntax of python with the performance enhancement that comes with statically typed languages.
The following sections will define the rat programming language

### [2 Formal Specification](/src/rat.ohm)

### 3 Language Description
**(2.1) PROGRAMS:**
**Programs** written in rat will consist of one or more statements
```rat
var i:int = 0;        # variable declaration
while (i <= 10){      # While statement
  print(i);           # print statement
  i += 1;             # augmented assignment statement 
}
```
**(2.2) VALUES & TYPES:**
So far, our language supports the following types:
- `int` of binary formatted signed values
- `float` of binary64 values
- `str` a string literal array of characters
- `bool` boolean value of `true` or `false`
- `[Type]` array of a specified type
- `{ Type:Type }` dictionary of a specified key:value pair types
- `none` Null value 
- `Type?` Optional Type utilized for values which may take on `none`
- `Type^` Promise Type to be used with asynchronous functions

```{rat}
var u:bool = false;
var v:int = 1;
var w:float = 2.0;
var x:str = "three";
var y:[int] = [4,5];
var z: { str:float } = { "six":6.0, "seven":7.0 };
```
**(2.3) DECLARATIONS:**
Rat language supports declarations which bind identifiers to one of the following:
- Variable (`const` or `var`)
- Function
- Parameter
Both variables and parameters are formatted with the identifier and the types separated by a colon. Functions are declared similar to how C declares functions, with the return type followed by the identifier, followed by it's parameters and a block containing 0 or more statements.

```rat
float foo(x:float, y:float){    # function + parameter declaration
  return x**2 + y**2;
}

var z: float = foo(3.0, 4.0);   # variable declaration
const w:float = sqrt(z);        # constant variable declaration
```

**(2.4) STATEMENTS:**
The following statements are supported in rat language (an example is given for each):
- Declarative statements: *see above*
- Return statements: `return value;`
- Assignment statements: `x = value;`
- Augmented Assignment statements: `x += 1;`
- Pass statements: `pass;`
- Break statements: `break;`
- Try Statements: `try{ pass; } catch(e:str){print(e);}`
- Control Flow Statements: *see below*

**(2.5) CONTROL FLOW:**
Rat language provides the `for-in` & `while` loops as well as conditional `if` statements 
- While Loops: `while (i < 4){print(i); i+= 1;} `
- For loop (Iterable Objects/expressions): `for i in iterable{print(i);}`
- For loop (Inclusive range): `for i in 0...5{print(i);}`
- For loop (Exclusive range): `for i in 0..<5{print(i);}`
- Conditional statements: `if false{ pass; } else if false { pass; } else { pass; }`


**(2.6) EXPRESSIONS:**
- Booleans : `true`, `false`
- None: `none` e.g. no value
- Negation: `-x`
- Logical NOT: `!x`
- Await: `await <<1200>> foo()`
- Logical OR: `x || y`
- Logical AND: `x && y`
- Relational: `<=, <, ==, !=, >=, >`, non-associative
- Additive: `x - y`,`x + y`, Left associative
- Multiplicative: `x * y`,`x / y`,`x % y` Left associative
- Exponentiation: `x ** y` Right associative

## Features
As a statically typed language, we aim to take Python to the next level. By enforcing set types for variables and functions, we offer a better overall performance than Pythonic languages. Further, adapting whitespace with simple, yet elegant bracketing, we leave no room for confusion when designing loops, functions, and statements.

## Examples
Each example will be posted in Rat followed by its JavaScript equivalent.

**helloWorld.rat**
```rat
print("Hello, World");
```

**helloWorld.js**
```javascript
console.log("Hello, World");
```

**fizzBuzz.rat**
```rat
void fizzbuzz(n:int){
  for i in 0...n {
  	var fbnum:str = "";
    if ((i % 3==0) || (i % 5 == 0)){
      if (i % 3 == 0){ fbnum += "Fizz"; }
      if (i % 5==0){ fbnum += "Buzz"; }
  	}else{ fbnum = str(i); }
    print(fbnum);
 }
}

# prints fizzbuzz up to 16 in this case
fizzbuzz(16);
```

**fizzBuzz.js**
```javascript
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    let output = "";
    if (i % 3 === 0) {
      output += "Fizz";
    }
    if (i % 5 === 0) {
      output += "Buzz";
    }
    console.log(output || i);
  }
}
```

**factorial.rat**
```rat
int factorial(n:int){
    var value:int = 1;
    if (n != 0 && n != 1){
        for i in 2...n {
            value *= i;
        }
    }
    return value;
}
```

**factorial.js**
```javascript
function factorial(n) {
    let result = 1;
    if (n != 0 && n != 1){
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
    }
    return result;
}
```

**fibonacci.rat**
```rat
int fib(n:int){
    # returns the nth value of the fibonacci sequence
    var a:int = 0;
    var b:int = 1;
    var c:int = 0;

    if (n == 0){
        return a;
    }
    for i in 2...n {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}
```

**fibonacci.js**
```javascript
function fibonacci(n) {
  let a = 0,
    b = 1,
    c;
  if (n === 0) return a;
  for (let i = 2; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
  }
  return b;
}
```

**prime.rat**
```rat
bool prime(n:int){
    if (n <= 1) { return false; }
    if (n <= 3) { return true; }
    if (n % 2 == 0) || (n % 3 == 0) { return false; }
    var i:int = 5;
    while i*i <= n {
    	if (n % i==0) || (n % (i+2)==0) {
        	return false;
        }
        i += 6;
    }
    return true;
}
```

**prime.js**
```javascript
function isPrime(number) {
  if (number <= 1) return false;
  if (number <= 3) return true;
  if (number % 2 === 0 || number % 3 === 0) return false;
  for (let i = 5; i * i <= number; i += 6) {
    if (number % i === 0 || number % (i + 2) === 0) return false;
  }
  return true;
}
```
