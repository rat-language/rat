from dataclasses import dataclass


@dataclass
class C:
  var: int


x = C(2)

print(x.var)

newVariable:C = None

print(isinstance(newVariable, C))