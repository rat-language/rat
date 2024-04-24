#include <algorithm>
#include <cmath>
#include <ctime>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

void helloWorld() { cout << "Hello World snail!" << endl; }

int factorial(int n) {
  // returns the nth value of the fibonacci sequence
  int value = 1;
  if (n != 0 && n != 1) {
    for (int i = 2; i <= n; i++) {
      value *= i;
    }
  }
  return value;
}

int fib(int n) {
  // returns the nth index value of the fibonacci sequence
  // (so the 0th is 0, the 1st is 1, 2nd is 1, etc))
  int a = 0; // var a:int = 0;
  int b = 1; // var b:int = 1;
  int c = 0; // var b:int = 0;

  if (n == 0) {
    return a;
  }
  for (int i = 2; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
  }
  return b;
}

void fizzbuzz(int n) {
  for (int i = 0; i <= n; i++) {
    string fbnum = "";
    if ((i % 3 == 0) || (i % 5 == 0)) {
      if (i % 3 == 0) {
        fbnum.append("Fizz");
      }
      if (i % 5 == 0) {
        fbnum.append("Buzz");
      }
    } else {
      fbnum = to_string(i);
    }
    cout << fbnum << endl;
  }
}

bool prime(int n) {
  if (n <= 1) {
    return false;
  }
  if (n <= 3) {
    return true;
  }
  if ((n % 2 == 0) || (n % 3 == 0)) {
    return false;
  }
  int i = 5;

  while (i * i <= n) {
    if (n % i == 0 || n % (i + 2) == 0) {
      return false;
    }
    i += 6;
  }
}

int main() {
  // int fact = fib(1);
  // cout << fact << endl;
  int numberInQuestion = 12;
  fizzbuzz(15);
  cout << prime(numberInQuestion) << endl;
  // string result = prime(numberInQuestion) ? "yes" : "no";
  // cout << "Is " << numberInQuestion << " prime? " << result << endl;
  
      return 0;
}