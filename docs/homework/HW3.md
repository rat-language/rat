# Homework 3

## 1
- **a**: not a compile time error
- **b**: not a compile time error
- **c**: static semantic error
- **d**: static semantic error
- **e**: static semantic error
- **f**: not a compile time error (runtime error)
- **g**: not a compile time error
- **h**: not a compile time error
- **i**: static semantic error
- **j**: not a compile time error
- **k**: syntax error
- **l**: syntax error
- **m**: not a compile time error

---
# 2

 **a. Undefined, NaN:** This output could be given in the scenario that hoisting was applied to the program. x could have been hoisted to the top of the function f() so in the local scope at the beginning, x would be assigned as undefined which then gets printed. In the next line when 2 is added to the previously "undefined" x, the output would becomes NaN.


**b. Error on line 3: x is not declared:** In this case, it shows that hoisting must not have been an option in this function. In this function, it seems that variables in the local scope must be declared before they are used.
    

**c. 75354253672, 75354253674:** This could be due to random assignment of variables before their declaration within the scope. The next number is two above just because the prebiously (randomly assigned variable) was reassigned to have 2 added to it.

**d. 3, -23482937128:** f() prints the global x which is 3. When the program reaches `var x = x + 2`, it results in an unexpected value  possibly due to underflow.

**e. Error on line 4: x used in its own declaration:** This error could be due to the usage of a variable before its declaration and initialization in the local scope, which then leads to an error.
 


