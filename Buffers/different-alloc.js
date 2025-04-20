//different type of alloc

const { Buffer } = require("buffer");

//1) .alloc() :  // Creates a 10-byte buffer initialized with zeros

const buff1 = Buffer.alloc(10); // Allocates 10 bytes of memory
console.log(buff1); // Output: <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buff1.toString("utf-8")); // Output: (empty string)

//2) .allocUnsafe() : Creates a 10-byte buffer with uninitialized memory

const buff2 = Buffer.allocUnsafe(10); // Allocates 10 bytes of memory
console.log(buff2); // Output: <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buff2.toString("utf-8")); // Output: (empty string)

//3) .from() :
const buff3 = Buffer.from("Hello World", "utf-8"); // Allocates 11 bytes of memory
console.log(buff3); // Output: <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
console.log(buff3.toString("utf-8")); // Output: Hello World

//4) .from() with array:
const buff4 = Buffer.from([72, 101, 108, 108, 111]); // Allocates 5 bytes of memory
console.log(buff4); // Output: <Buffer 48 65 6c 6c 6f>

//5) allocUnsafe with string:
const buff5 = Buffer.allocUnsafe("Hello World"); // Allocates 11 bytes of memory
console.log(buff5); // Output: <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
console.log(buff5.toString("utf-8")); // Output: Hello World

//6) allocUnsafe with array:
const buff6 = Buffer.allocUnsafe([72, 101, 108, 108, 111]); // Allocates 5 bytes of memory
console.log(buff6); // Output: <Buffer 48 65 6c 6c 6f>
//allocateUnsafeSlow()
//7) allocUnsafeSlow with string:
const buff7 = Buffer.allocUnsafeSlow("Hello World"); // Allocates 11 bytes of memory
