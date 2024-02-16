![alt text](/docs/rat.png)

# RAT

## Why Rat?

mmmm cheeeeeeese...
Originally, following a decent amount of Pythonic structure, we began thinking of naming our child after some of the great Snake languages. However, having noticed how popular Python is for its legibility, yet its overall lack of exciting performance, we began to brainstorm ways to leave the Snake game behind. Thus birthing RAT. See, being created from a small group of LMU Computer Scientists, we understand our position as the small language in this wide world of Programming. Yet, unlike in the natural world, we are no prey. We are a: **R**eally. **A**wesome. **T**eam.

## Features

As a Statically Typed language, we aim to take Python to the next level. By enforcing set types for variables and functions, we offer a better overall performance than Pythonic languages. Further, adapting whitespace with simple, yet elegant bracketing, we leave no room for confusion when designing loops, functions, and statements.

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
      if (i % 3 == 0){ fbnum += "Fizz";}
      if (i % 5==0){ fbnum += "Buzz";}
  	}else{fbnum = str(i);}
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
