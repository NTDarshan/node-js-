//Buffers
// Buffers are used to store binary data
// Buffers are immutable, meaning once created, they cannot be changed
// Buffers are similar to arrays, but they are not the same
// Buffers are used to store binary data, such as images, audio files, etc.

// Fix: Use Buffer directly (it's global) or import correctly
const Buffer = require("buffer").Buffer;
// Alternatively: const { Buffer } = require("buffer");

// Creating a buffer using the Buffer constructor
const memoryContainer = Buffer.alloc(4); // Allocates 8 bytes of memory

// //assigning the values to the buffer
memoryContainer[0] = 1;
memoryContainer[1] = 2;
memoryContainer[2] = 3;
memoryContainer[3] = 4;

console.log(memoryContainer[0]); // Output: 1
console.log(memoryContainer[1]); // Output: 2
console.log(memoryContainer[2]); // Output: 3
console.log(memoryContainer[3]); // Output: 4

console.log(memoryContainer); // Output: <Buffer 01 02 03 04>
console.log(memoryContainer.toString("hex")); // Output: 01020304

const Buff = Buffer.from([0x48, 0xce, 0x13, 0x7f]); // 32 bits / 8 =>  Allocates 4 bytes of memory

console.log(Buff.toString("utf-8")); // Output: 72

const Buff1 = Buffer.from("48ce137f", "hex"); // 32 bits / 8 =>  Allocates 4 bytes of memory
console.log(Buff1.toString("utf-8")); // Output: HÎ

const Buff2 = Buffer.from("Hi !!", "utf-8"); // 32 bits / 8 =>  Allocates 4 bytes of memory
console.log(Buff2); // Output: 48692121

//allocating huge buffers

const b = Buffer.alloc(1e9);

setInterval(() => {
  b.fill(1);
  console.log("Buffer filled");
}, 5000);
