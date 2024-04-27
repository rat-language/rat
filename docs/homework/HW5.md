# Homework 5
-----------
## 1.

#### A. /^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ]\s[0-9[ABCEGHJKLMNPRSTVWXYZ][0-9]$/ 
 

#### B. /^4\d{3}(\d{12}|\d{9})\d{3}$/ 


#### C. /^(5[1-5]\d{14}|2(2[2-9][1-9]|2[3-9]\d|3[0-9]\d|4[0-9]\d|5[0-9]\d|6[0-9]\d|7[01]\d|720)\d{12})$/ 

 
#### D. /^(?!.*\b[^\s]{3}oo\b)[^\d\s]+$/iu 

 
#### E. ^0+$|^[01]*0{4,}$ 


#### F. /^([8-9]|[12]\d|3[0-2])$/ 


#### G. //^(?!.*\b(python|pycharm|(?<!\p{Lu})pyc(?!\p{Lu}))\b)[^\d\s]+$/u 


#### H. /^[-+]?\d*\.?\d+e[-+]?\d{1,3}$/i/^((a|b|c)|(aa|bb|cc)|(aaa|aba|aca|bab|bbb)|(ababa|abcba|abaaaaba|aaaaaaaa|caaaaaac|cbcbbcbc))$/ 

 
#### J. /^(?:[rfbu]{0,2})?((?:"""(?:\\"|\\?[^"]|""?(?!"))*""")|(?:'''(?:\\'|\\?[^']|''?(?!'))*''')|(?:"(?:\\"|[^"\r\n])*")|(?:'(?:\\'|[^'\r\n])*'))$/ 


## 2.

Given input <M, w>, we create two Turing machines, M1 and M2, as follows:

M1: It emulates M on input w. If M halts, M1 accepts; otherwise, it enters an infinite loop.

M2: Rejects all inputs.

To tackle the Halting Problem, we utilize a Decider for {M1{}M2 | L(M1) = L(M2)} in the following manner:

Concatenate M1 and M2 (i.e., M1{}M2) and input it into the supposed decider D.

If D accepts M1{}M2, then M halts on input w.

If D rejects M1{}M2, then M does not halt on input w.  

 
