// 01110
// 10001
// 10011
// 10101
// 11001
// 10001
// 01110
var nums =[
"01110100011001110101110011000101110",
// 01100
// 00100
// 00100
// 00100
// 00100
// 00100
// 11111
"01100001000010000100001000010011111",
// 01110
// 10001
// 00001
// 00110
// 01000
// 10000
// 11111
"01110100010000100110010001000011111",
// 01110
// 10001
// 00001
// 01110
// 00001
// 10001
// 01110
"01110100010000101110000011000101110",
// 00010
// 00110
// 01010
// 10010
// 11111
// 00010
// 00010
"00010001100101010010111110001000010",
// 11111
// 10000
// 11110
// 00001
// 00001
// 10001
// 01110
"11111100001111000001000011000101110",
// 00110
// 01000
// 10000
// 11110
// 10001
// 10001
// 01110
"00110010001000011110100011000101110",
// 11111
// 00001
// 00010
// 00100
// 01000
// 01000
// 01000
"11111000010001000100010000100001000",
// 01110
// 10001
// 10001
// 01110
// 10001
// 10001
// 01110
"01110100011000101110100011000101110",
// 01110
// 10001
// 10001
// 01111
// 00001
// 00010
// 01100
"01110100011000101111000010001001100"];
// 00000
// 00000
// 00000
// 00000
// 00000
// 00000
// 00100
var dot = "00000000000000000000000000000000100"; 
// 000
// 000
// 010
// 000
// 010
// 000
// 000
var narrowcol = "000000010000010000000";
// 00000
// 00000
// 00100
// 00000
// 00100
// 00000
// 00000
var col = "00000000000010000000001000000000000";
// 00000
// 00000
// 01110
// 00001
// 01111
// 10001
// 01111
var lower = {
a : "00000000000110000010011101001001111",
// 10000
// 10000
// 10000
// 10110
// 11001
// 10001
// 11110
b : "10000100001011011001100011000111110",
// 00000
// 00000
// 01110
// 10000
// 10000
// 10001
// 01110
c : "00000000000111010000100001000101110",
// 00001
// 00001
// 00001
// 01101
// 10011
// 10001
// 01111
d : "00001000010110110011100011000101111",
// 00000
// 00000
// 01110
// 10001
// 11110
// 10000
// 01110
e : "00000000000111010001111101000001110",
// 00110
// 01001
// 01000
// 11100
// 01000
// 01000
// 01000
f : "00100010100100011100010000100001000",
// 00000
// 01111
// 10001
// 10001
// 01111
// 00001
// 01110
g : "00000011111000110001011110000101110",
// 10000
// 10000
// 10110
// 11001
// 10001
// 10001
// 10001
h : "10000100001011011001100011000110001",
// 00000
// 00100
// 00000
// 00100
// 00100
// 00100
// 00100
i : "00100000000110000100001000010011111",
// 00010
// 00000
// 00110
// 00010
// 00010
// 10010
// 01100
j : "00010000000011000010000101001001100",
// 10000
// 10000
// 10010
// 10100
// 11000
// 10100
// 10010
k : "10000100001001010100110001010010010",
// 01100
// 00100
// 00100
// 00100
// 00100
// 00100
// 01110
l : "01100001000010000100001000010001110",
// 00000
// 00000
// 11010
// 10101
// 10101
// 10001
// 10001
m : "00000000001101010101101011000110001",
// 00000
// 00000
// 10110
// 11001
// 10001
// 10001
// 10001
n : "00000000001011011001100011000110001",
// 00000
// 00000
// 01110
// 10001
// 10001
// 10001
// 01110
o : "00000000000111010001100011000101110",
// 00000
// 00000
// 11110
// 10001
// 11110
// 10000
// 10000
p : "00000000001111010001111101000010000",
// 00000
// 00000
// 01101
// 10011
// 01111
// 00001
// 00001
q : "00000000000110110011011110000100001",
// 00000
// 00000
// 10110
// 11001
// 10000
// 10000
// 10000
r : "00000000001011011001100001000010000",
// 00000
// 00000
// 01110
// 10000
// 01110
// 00001
// 11110
s : "00000000000111010000011100000111110",
// 01000
// 01000
// 11100
// 01000
// 01000
// 01001
// 00110
t : "01000010001110001000010000100100110",
// 00000
// 00000
// 10001
// 10001
// 10001
// 10011
// 01101
u : "00000000001000110001100011001101101",
// 00000
// 00000
// 10001
// 10001
// 10001
// 01010
// 00100
v : "00000000001000110001100010101000100",
// 00000
// 00000
// 10001
// 10001
// 10101
// 10101
// 01010
w : "00000000001000110001101011010101010",
// 00000
// 00000
// 10001
// 01010
// 00100
// 01010
// 10001
x : "00000000001000101010001000101010001",
// 00000
// 00000
// 10001
// 10001
// 01111
// 00001
// 01110
y : "00000000001000110001011110000101110",
// 00000
// 00000
// 11111
// 00010
// 00100
// 01000
// 11111
z : "00000000001111100010001000100011111"}
