

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

##### **a.** \(\{ w \in \{a, b\}^* \mid w \text{ ends with } abb\}\)
##### **b.** \(\{ w \in \{a, b\}^* \mid \#_a(w) = \#_b(w) \}\) $\textrm{(same number of a's as b's)} $
##### **c.**\(\{ w \in \{a, b\}^* \mid w \text{ alternates a's and b's}\}\)
##### **d.**\(\{ a^{n}b^{2n} \mid n \geq 0 \}\)


### 6. Give Turing Machines that compute the following functions, where the input and output are binary numerals.
##### **a.** $\lambda n . 2 n + 2$
##### **b.** $ \textrm{one's complement} $
##### **b.** $ \textrm{The function described in Python as } \lambda n: str(n)[1:-1] $

### 7. Give grammars for the following languages (using the notation from class):

##### **a.** $ \textrm{Show a 3AC machine program to evaluate this expression, leaving the result in} $
##### **b.** $ \textrm{Show a Stack machine program to evaluate this expression, leaving the result on the top of the stack.} $

### 8. Give grammars for the following languages (using the notation from class):

##### **a.** \(\{ a^{i}b^{j}c^{k} \mid i > j > k \}\)
##### **b.** \(\{ a^{i}b^{j}c^{k} \mid i > j \land k = i - j \}\)
##### **c.** \(\{ \langle M \rangle \mid M \text{ accepts } \omega \}\)
##### **d.** \(\{ G \mid G \text{ is context-free } \land L(G) = \emptyset \}\)
##### **e.** \(\{ a^{n}b^{n}c^{n} \mid n \geq 0 \}\)
##### **f.** \(\{ \langle M \rangle \mid M \text{ does not halt } \}\)
##### **g.** \(\{ w \mid w \text{ is a decimal numeral divisible by } 7 \}\)
##### **h.** \(\{ \omega\omega\omega \mid \omega \text{ is a string over the Unicode alphabet} \}\)

