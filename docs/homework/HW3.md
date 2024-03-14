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

## 2

 **a. Undefined, NaN:** This output could be given in the scenario that hoisting was applied to the program. x could have been hoisted to the top of the function f() so in the local scope at the beginning, x would be assigned as undefined which then gets printed. In the next line when 2 is added to the previously "undefined" x, the output would becomes NaN. 


**b. Error on line 3: x is not declared:** In this case, it shows that hoisting must not have been an option in this function. In this function, it seems that variables in the local scope must be declared before they are used.
    

**c. 75354253672, 75354253674:** This could be due to random assignment of variables before their declaration within the scope. The next number is two above just because the prebiously (randomly assigned variable) was reassigned to have 2 added to it.

**d. 3, -23482937128:** f() prints the global x which is 3. When the program reaches `var x = x + 2`, it results in an unexpected value  possibly due to underflow.

**e. Error on line 4: x used in its own declaration:** This error could be due to the usage of a variable before its declaration and initialization in the local scope, which then leads to an error.
 
---

## 3

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



## 4
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


## 5

**Python Version**
```
def find(arr, current_min=float('inf'), index = 0):
    #Base case: if the index is the length of the array than the current minimum is returned
    if index == len(arr):
        return current_min
    
    #Updates the current minimum
    new_min = min(current_min, arr[index])

    #Recursivly call with the next index, along with the new minimum
    return find_min(arr, new_min, index + 1)

#Sample
array = [3.5, 2.1, 5.6, -1.4, 3.2]
minimum = find_min(array)
print("Minimum value:", minimum)

```

**Rust Version**
```
fn find_min(values: &[f64], current_min: f64) -> f64 {
    match values.split_first() {
        Some((first, rest)) => {
            let new_min = if *first < current_min { *first } else { current_min };
            find_min(rest, new_min)
        },
        None => current_min,
    }
}

#Sample
fn main() {
    let values = vec![3.5, 2.1, 4.6, 2.0, 3.2];
    let min = find_min(&values, f64::MAX);
    println!("The minimum value is: {}", min);
}
```

## 6

```
function countDownFromTen() {
  function update(i) {
    document.getElementById("t").innerHTML = i;
    if (i-- > 0) setTimeout(() => update(i), 1000);  // Fixed by adding arrow function
  }
  update(10);
}
```

The second code block can be fixed by adding the arrow function `() => update(i)`. The previous use of setTimeout(updat(i), 1000) immediately exececutes the update component, which in turn gives no time for a count-down and in consequnece, an infinite loop of going through the same initial number. With the addition of the arrow function, an anonymous function is created that will call `update(i)` when it is excuted by `setTimeout` after the 1 second delay.


## 7

```
import java.util.HashMap;

class C {
    static final HashMap<String, Integer> m = new HashMap<String, Integer>();

    static int zero() {
        return 0;
    }

    public C() {
    }
}
```

### Linter Errors and Notes

#### Line 1:
- **Error**: Move this file to a named package.sonarlint(java:S1220)
- **Note**: Java classes should be organized into named packages to avoid conflicts and improve maintainability. The default package is not recommended for anything beyond simple experiments or temporary code.

#### Line 4:
- **Error**: Replace the type specification in this constructor call with the diamond operator ("<>"). (sonar.java.source not set. Assuming 7 or greater.)sonarlint(java:S2293)
- **Note**: Since Java 7, the diamond operator (`<>`) can be used to simplify the instantiation of generic classes by inferring the type parameters. This makes the code cleaner and easier to read.

#### Line 7:
- **Error**: Remove this method and declare a constant for this value.sonarlint(java:S3400)
- **Note**: The `zero()` method returns a constant value (`0`). Such values are better represented as constants in the class to avoid unnecessary method calls and improve code readability.

#### Line 10:
- **Error**: Add a nested comment explaining why this method is empty, throw an UnsupportedOperationException or complete the implementation.sonarlint(java:S1186)
- **Note**: An empty constructor like this may be intentional, but it's good practice to document the reason. If it's unused or not meant to be instantiated, consider throwing an `UnsupportedOperationException` or making the constructor private to prevent instantiation.


