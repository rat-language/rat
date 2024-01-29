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
&nbsp;var i:int = 0
&nbsp;for (i = 0; i <= n; i++){
&nbsp;&nbsp;if ((i % 3==0) || (i % 5 == 0)){
&nbsp;&nbsp;&nbsp;if (i % 3 == 0){
&nbsp;&nbsp;&nbsp;&nbsp;print("Fizz", end="");
&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;if (i % 5==0){
&nbsp;&nbsp;&nbsp;&nbsp;print("Buzz", end="");
&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;print("");
&nbsp;&nbsp;}
&nbsp;&nbsp;else{
&nbsp;&nbsp;&nbsp;print(i);
&nbsp;&nbsp;}
&nbsp;}
}

function fizzBuzz(n) {
&nbsp;for (let i = 1; i <= n; i++) {
&nbsp;&nbsp;let output = '';
&nbsp;&nbsp;if (i % 3 === 0) {
&nbsp;&nbsp;&nbsp;output += 'Fizz';
&nbsp;&nbsp;}
&nbsp;&nbsp;if (i % 5 === 0) {
&nbsp;&nbsp;&nbsp;output += 'Buzz';
&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;console.log(output || i);
&nbsp;}
}

int factorial(n:int){
&nbsp;var value:int = 1;
&nbsp;var i:int = 1;
&nbsp;while(i <= n){
&nbsp;&nbsp;value = value \* i;
&nbsp;&nbsp;i = i + 1;
&nbsp;}
&nbsp;return value;
}

function factorial(n) {
&nbsp;let result = 1;
&nbsp;for (let i = 2; i <= n; i++) {
&nbsp;&nbsp;result \*= i;
&nbsp;}
&nbsp;return result;
}

int fib(n:int){
&nbsp;// returns the nth value of the fibonacci sequence
&nbsp;var a:int = 0;
&nbsp;var b:int = 1;
&nbsp;var c:int = 0;
&nbsp;var i:int = 2;

&nbsp;if (n == 0){
&nbsp;&nbsp;return a;
&nbsp;}
&nbsp;for (i = 2; i <= n; i++) {
&nbsp;&nbsp;c = a + b;
&nbsp;&nbsp;a = b;
&nbsp;&nbsp;b = c;
&nbsp;}
&nbsp;return b;
}

function fibonacci(n) {
&nbsp;let a = 0, b = 1, c;
&nbsp;if (n === 0) return a;
&nbsp;&nbsp;for (let i = 2; i <= n; i++) {
&nbsp;&nbsp;&nbsp;c = a + b;
&nbsp;&nbsp;&nbsp;a = b;
&nbsp;&nbsp;&nbsp;b = c;
&nbsp;&nbsp;}
&nbsp;return b;
}

bool prime(n:int){
&nbsp;if (n <= 1) {
&nbsp;&nbsp;return false;
&nbsp;}
&nbsp;if (n <= 3) {
&nbsp;&nbsp;return true;
&nbsp;}
&nbsp;if (n % 2 == 0) || (n % 3 == 0) {
&nbsp;&nbsp;return false;
&nbsp;}
&nbsp;for (i = 5; i \* i <= n; i += 6) {
&nbsp;&nbsp;if ((n % i == 0) || (n % (i + 2)) == 0){
&nbsp;&nbsp;&nbsp;return false;
&nbsp;&nbsp;}
&nbsp;}
&nbsp;return true;
}

function isPrime(number) {
&nbsp;if (number <= 1) return false;
&nbsp;if (number <= 3) return true;
&nbsp;if (number % 2 === 0 || number % 3 === 0) return false;
&nbsp;for (let i = 5; i \* i <= number; i += 6) {
&nbsp;&nbsp;if (number % i === 0 || number % (i + 2) === 0) return false;
&nbsp;}
&nbsp;return true;
}
