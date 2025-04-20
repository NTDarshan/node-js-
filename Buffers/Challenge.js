//0100 , 1000, 1100, 1110, 0001, 0011, 0111, 1111

const { Buffer } = require("buffer");

const bufferContainer = Buffer.alloc(4); // 32 bits / 8 =>  Allocates 4 bytes of memory

bufferContainer[0] = 0x48;
bufferContainer[1] = 0xce;
bufferContainer[2] = 0x13;
bufferContainer[3] = 0x7f;

console.log(bufferContainer[0]); // Output: 72
console.log(bufferContainer[1]); // Output: 206
console.log(bufferContainer[2]); // Output: 19
console.log(bufferContainer[3]); // Output: 127
console.log(bufferContainer); // Output: <Buffer 48 ce 13 7f>
console.log(bufferContainer.toString("hex")); // Output: 48ce137f
console.log(bufferContainer.toString("utf-8")); // Output: HÎ
