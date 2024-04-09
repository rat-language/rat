const semanticChecks = [
  //------------( WORKING )-----------------//
  ["optional types", 'var x:int? = None; x = some 100;'],
  ["variables", 'var x: int =[[[[1]]]]; print(x[0][0][0][0]+2);'],
  ["subscript exp", 'var a: list =[1,2];print(a[0]);'],
  ["call of assigned functions", 'void f(x: int) {} const g : function = f; g(1);'],
  ["type equivalence of nested arrays", 'void f(x: [[int]]) {} print(f([[1],[2]]));'],
  ["call of assigned function in expression", 'void f(x: int, y: boolean) {} const g: function = f; print(g(1, true)); f = g;'],
  ["pass a function to a function", 'int f(x: int, y: function) { return 1; } function g(z: boolean) {} f(2, g);'],
  ["function return types", 'int square(x: int) { return x * x; } function compose() { return square;}'],
  ["outer variable", 'var x: int =1; while(false) {print(x);}'],
  // The following tests require clarification or might be working based on the language's capabilities, so they are commented out for further review.
  // ["function assign", 'function f() {} var g : function = f; var h : function = [g, f]; print(h[0]());'],
  // ["array parameters", 'function f(x: [int?]) {}'],
  // ["optional parameters", 'function f(x: [int], y: string?) {}'],
  // ["types in function type", 'function f(g: (int?, float)->string) {}'],
  // ["voids in fn type", 'function f(g: void->void) {}'],
  
  // Built-in constants and functions like π, sin, cos, hypot are not directly mentioned in your grammar. If they are implemented, they should be tested as well.
  // ["built-in constants", 'print(25.0 * π);'],
  // ["built-in sin", 'print(sin(π));'],
  // ["built-in cos", 'print(cos(93.999));'],
  // ["built-in hypot", 'print(hypot(-4.0, 3.00001));'],
];
