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
 
---

# 3

Yes, a different order to the parameters being passed into the function would in-fact change the output of the given function.

An example of this can be seen with the code block 
```
i = 0
def next():
    global i
        i += 1
    return 1

f(next(), next())
```

In this code, it can be seen that if the "first next" were called first within the functin (left-to-right), the output would be `f(1, 2)` otherwise, if the second next were called first (right-to-left) the output would be `f(2, 1)`.



# 4
The handling for recursive structs can be seen in analyzer.js

```
    TypeDecl(_struct, id, _left, fields, _right) {
      const type = core.structType(id.sourceString, [])
      mustNotAlreadyBeDeclared(id.sourceString, { at: id })
      context.add(id.sourceString, type)
      type.fields = fields.children.map(field => field.rep())
      mustHaveDistinctFields(type, { at: id })
      mustNotBeSelfContaining(type, { at: id })
      return core.typeDeclaration(type)
    },
```

In this section of the analyzer, as soon as the analyzer sees a struct declaration, it inserts this struct type into the context before analyzing the fields.  

This allows for recursive structs as the field types of the struct can also be of the struct type as it is in the context.

For instance, if we declare struct Node, the fields can also be of type Node as this struct exists in the context.

After parsing the fields, they are added to the struct type by this line:

```
      type.fields = fields.children.map(field => field.rep())
```

In handling recursion, the analyzer makes sure the recursive structs are defined correctly.  

It does this by:
1. ensuring field names are distinct
2. making sure structs are not self containing which would create non-terminating types.  This is ensured by this function:

```
  function mustNotBeSelfContaining(structType, at) {
    const containsSelf = includesAsField(structType, structType)
    must(!containsSelf, "Struct type must not be self-containing", at)
  }
  ```

  The difference between recursive structs and self-containing structs is that self containing structs contain instances of itself whereas recursive structs contain references of a struct of the same type.