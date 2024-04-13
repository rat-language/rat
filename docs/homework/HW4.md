# Homework 4
---

## 3. Give grammars for the following languages (using the notation from class):

#### **a.** $\textrm{The Empty Langauge}$

$ \textrm{emptyLanguage} = \varepsilon $

#### **b.** $\{0^{i}1^{j}2^{k} \mid i = j \vee j = k\}$

$ 
S \rightarrow \text{MatchedZerosOnes} \mid \text{MatchedOnesTwos} \\
\text{MatchedZerosOnes} \rightarrow \text{"0"} \text{MatchedZerosOnes} \text{"1"} \mid \text{Middle} \\
\text{MatchedOnesTwos} \rightarrow \text{"1"} \text{MatchedOnesTwos} \text{"2"} \mid \text{Middle} \\
\text{Middle} \rightarrow \varepsilon
$

#### **c.** $\{w \in \{0, 1\}^* \mid w \text{ does not contain the substring } 000\}$
$
S \rightarrow \text{OneOrZero}S \mid \varepsilon \\
\text{OneOrZero} \rightarrow \text{"1"} \mid \text{NotThreeZeros} \\
\text{NotThreeZeros} \rightarrow \text{"0"}\ \text{MaybeTwoZeros} \\
\text{MaybeTwoZeros} \rightarrow \text{"0"}?\ \text{OneAfterZero} \\
\text{OneAfterZero} \rightarrow \text{"1"}S \mid \varepsilon
$

#### **d.** $\{w \in \{a, b\}^* \mid w \text{ has twice as many } a\text{'s as } b\text{'s}\}$
$
S \rightarrow \text{TwiceAsManyAs} \mid \varepsilon \\
\text{TwiceAsManyAs} \rightarrow \text{"a"} \text{TwiceAsManyAs} \text{"a"} \text{SingleB} \\
\text{SingleB} \rightarrow \text{"b"}\ \text{S}
$

#### **e.** $\{a^{n}b^{n}a^{n}b^{n} \mid n \geq 0\}$
$
S \rightarrow \text{EqualAsBs} \mid \varepsilon \\
\text{EqualAsBs} \rightarrow \text{"a"} \text{EqualAsBs} \text{"b"} \text{SecondHalf} \\
\text{SecondHalf} \rightarrow \text{"a"} \text{SecondHalf} \text{"b"} \mid \varepsilon
$
### 5. Give Turing Machines that recognize the following languages. If any of the languages below are Type-3, you may (and are encouraged to) give a FA in lieu of a TM recognizer, if the FA is simpler.

#### **a.** \(\{ w \in \{a, b\}^* \mid w \text{ ends with } abb\}\)
#### **b.** \(\{ w \in \{a, b\}^* \mid \#_a(w) = \#_b(w) \}\) $\textrm{(same number of a's as b's)} $
#### **c.**\(\{ w \in \{a, b\}^* \mid w \text{ alternates a's and b's}\}\)
#### **d.**\(\{ a^{n}b^{2n} \mid n \geq 0 \}\)


### 6. Give Turing Machines that compute the following functions, where the input and output are binary numerals.
#### **a.** $\lambda n . 2 n + 2$
**1. Initialization (Unary):**
- Start at the beginning of the tape.
- Find the first '1' to indicate the start of the input.

**2. Mark and Double:**
- Replace the first '1' with a marker symbol 'X' to indicate it has been processed.

**3. Append Two '1's:**
- Move to the right end of the tape, past the last '1'.
- Append two '1's for each 'X' encountered.

**4. Loop Back:**
- After appending, move back to the next unmarked '1'.
- If an unmarked '1' is found, go to step 2.
- If no unmarked '1' remains, proceed to the next step.

**5. Add Two:**
- Once all '1's have been doubled, append two additional '1's at the end of the tape.

**6. Cleanup (Optional):**
- Replace all the 'X' markers back to '1's, if the original input needs to be restored.

**7. Halt:**
- Move the head to a position indicating completion.
- Enter the halt state.
#### **b.** $ \textrm{one's complement} $
**Step 1:** Start at the beginning of the tape where the binary number begins.

**Step 2:** Read the current symbol.
- If it is '0', write '1'.
- If it is '1', write '0'.
- Move the tape head to the right.

**Step 3:** Repeat Step 2 for each bit in the number until a blank symbol is encountered, indicating the end of the number.

**Step 4:** Once the end of the number is reached, enter the halt state to signify completion.

#### **c.** $ \textrm{The function described in Python as } \lambda n: str(n)[1:-1] $
**Step 1:** Initialize by finding the start of the number on the tape.

**Step 2:** Move right to skip the first character of the number's representation.

**Step 3:** Continue moving right until you find the last character. This is done by detecting a blank space indicating the end of the number.

**Step 4:** Once the last character is found, move left to unmark it or overwrite it with a blank symbol.

**Step 5:** Shift the entire string to the left to close the gap, if necessary, by repeatedly moving all characters one position to the left until the original position of the first character is reached.

**Step 6:** When the shift is complete, and the first and last characters have been removed, enter the halt state.



### 7. For the JavaScript/Python expression 5 * 3 - 1 ** 3

##### **a.** $ \textrm{Show a 3AC machine program to evaluate this expression, leaving the result in}\ r0$

t1 = 5 * 3      // Multiply 5 by 3 and store the result in temporary variable t1
t2 = 1 ** 3     // Raise 1 to the power of 3 and store the result in temporary variable t2
r0 = t1 - t2    // Subtract t2 from t1 and store the result in r0

##### **b.** $ \textrm{Show a Stack machine program to evaluate this expression, leaving the result on the top of the stack.} $

PUSH 5          // Push 5 onto the stack
PUSH 3          // Push 3 onto the stack
MULTIPLY        // Pop the top two elements, multiply them, and push the result back on the stack
PUSH 1          // Push 1 onto the stack
PUSH 3          // Push 3 onto the stack
POWER           // Pop the top two elements, calculate the power, and push the result back on the stack
SUBTRACT        // Pop the top two elements, subtract the second from the first, and push the result back on the stack


### 8. Characterize each of the following languages as either (a) regular, (b) context-free but not regular, (c) recursive but not context-free, (d) recursively enumerable but not recursive, or (e) not even recursively enumerable.
##### **a.** \(\{ a^{i}b^{j}c^{k} \mid i > j > k \}\)
##### **b.** \(\{ a^{i}b^{j}c^{k} \mid i > j \land k = i - j \}\)
##### **c.** \(\{ \langle M \rangle \mid M \text{ accepts } \omega \}\)
##### **d.** \(\{ G \mid G \text{ is context-free } \land L(G) = \emptyset \}\)
##### **e.** \(\{ a^{n}b^{n}c^{n} \mid n \geq 0 \}\)
##### **f.** \(\{ \langle M \rangle \mid M \text{ does not halt } \}\)
##### **g.** \(\{ w \mid w \text{ is a decimal numeral divisible by } 7 \}\)
##### **h.** \(\{ \omega\omega\omega \mid \omega \text{ is a string over the Unicode alphabet} \}\)

