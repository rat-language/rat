![alt text](/docs/rat.png)

# RAT

### Why Rat?

mmmm cheeeeeeese...
Originally, following a decent amount of Pythonic structure, we began thinking of naming our child after some of the great Snake languages. However, having noticed how popular Python is for its legibility, yet its overall lack of exciting performance, we began to brainstorm ways to leave the Snake game behind. Thus birthing RAT. See, being created from a small group of LMU Computer Scientists, we understand our position as the small language in this wide world of Programming. Yet, unlike in the natural world, we are no prey. We are a: **R**eally. **A**wesome. **T**eam.

### Features

As a Statically Typed language, we aim to take Python to the next level. By enforcing set types for variables and functions, we offer a better overall performance than Pythonic languages. Further, adapting whitespace with simple, yet elegant bracketing, we leave no room for confusion when designing loops, functions, and statements.

### Examples

Each example will be posted in RAT followed by its JS equivalent.

print("Hello, World");

console.log("Hello, World")

void fizzbuzz(n:int){
var i:int = 0
for (i = 0; i <= n; i++){
if ((i % 3==0) || (i % 5 == 0)){
if (i % 3 == 0){
print("Fizz", end="");
}
if (i % 5==0){
print("Buzz", end="");
}
print("");
}
else{
print(i);
}
}
}

```javascript
function fizzBuzz(n) {
    for (let i = 1; i <= n; i++) {
    let output = '';
    if (i % 3 === 0) {
    output += 'Fizz';
    }
    if (i % 5 === 0) {
    output += 'Buzz';
    }
    console.log(output || i);
    }
}
```

```rat
int factorial(n:int){
var value:int = 1;
var i:int = 1;
while(i <= n){
value = value \* i;
i = i + 1;
}
return value;
}
```

```javascript
function factorial(n) {
let result = 1;
for (let i = 2; i <= n; i++) {
result \*= i;
}
return result;
}
```

```rat
int fib(n:int){
// returns the nth value of the fibonacci sequence
var a:int = 0;
var b:int = 1;
var c:int = 0;
var i:int = 2;

if (n == 0)
return a;

for (i = 2; i <= n; i++) {
c = a + b;
a = b;
b = c;
}
return b;
}
```

```javascript
function fibonacci(n) {
    let a = 0, b = 1, c;
    if (n === 0) return a;
    for (let i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
return b;
}
```

bool prime(n:int){
if (n <= 1) {
return false;
}
if (n <= 3) {
return true;
}
if (n % 2 == 0) || (n % 3 == 0) {
return false;
}
for (i = 5; i \* i <= n; i += 6) {
if ((n % i == 0) || (n % (i + 2)) == 0){
return false;
}
}
return true;
}

function isPrime(number) {
if (number <= 1) return false;
if (number <= 3) return true;

    if (number % 2 === 0 || number % 3 === 0) return false;

    for (let i = 5; i * i <= number; i += 6) {
        if (number % i === 0 || number % (i + 2) === 0) return false;
    }
    return true;

}
