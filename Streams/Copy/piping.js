// Piping in Node.js - A mechanism to connect readable streams to writable streams , it handles backpressure and events automatically. It's a high-level abstraction built on top of streams.
const fs = require("node:fs/promises");

(async () => {
  // Open the source file in read mode
  const source = await fs.open("scr.txt", "r");

  // Open the destination file in write mode
  const destination = await fs.open("dest.txt", "w");

  // Create a readable stream from the source file
  // This allows reading the file data in chunks
  const ReadableStream = source.createReadStream();

  // Create a writable stream for the destination file
  // This allows writing data in chunks
  const WritableStream = destination.createWriteStream();

  // Connect the readable stream to the writable stream using pipe()
  // This automatically handles data flow, backpressure, and event management
  ReadableStream.pipe(WritableStream);
})();

//What is Piping in Node.js?
//Piping is a mechanism in Node.js that connects a readable stream to a writable stream, automatically managing the flow of data between them. It's like connecting two pipes together - data flows from the readable stream into the writable stream without manual intervention.
//Why You Should Be Cautious with Piping in Production
//While piping is convenient, it has several limitations for production use:
//1.Memory Management Issues : The basic pipe() method doesn't provide fine-grained control over memory usage, which can lead to memory leaks in high-traffic applications.
//2.Complexity : Piping can make code more complex and harder to maintain, especially when dealing with multiple streams or backpressure scenarios.
//3.Error Handling : The basic pipe() doesn't handle errors well. If an error occurs in either stream, it may not be properly propagated, leading to silent failures.
//4: Resource Cleanup : When errors occur, resources might not be properly cleaned up, leading to file descriptor leaks.
//5: No Proper Event Handling : Piping doesn't provide explicit event handling for backpressure, errors, or completion.
//6: Performance : Piping can be less efficient than manual chunk handling, especially in scenarios with high data throughput.
//7: Difficult Debugging : Debugging issues in complex piping scenarios can be challenging.

//The Better Alternative: pipeline()
//The pipeline() function from the stream module is the recommended alternative:

//const { pipeline } = require("node:stream");
// or for promise-based version:
const { pipeline } = require("node:stream/promises");

(async () => {
  const source = await fs.open("scr.txt", "r");
  const destination = await fs.open("dest.txt", "w");

  const readStream = source.createReadStream();
  const writeStream = destination.createWriteStream();

  // Using pipeline instead of pipe
  await pipeline(readStream, writeStream);

  console.log("Pipeline succeeded");
})().catch((err) => {
  console.error("Pipeline failed", err);
});

//Benefits of pipeline() :
// 1. Proper Error Handling : Automatically propagates errors and provides a single point for error handling
// 2. Resource Cleanup : Automatically closes all streams when done or when errors occur
// 3. Promise Support : The promise version allows for clean async/await syntax
// 4. Transform Streams : Easily add transform streams in the middle for data processing
// 5. Memory Management : Better handling of backpressure and memory usage
// For production applications, always prefer pipeline() over the basic pipe() method to ensure robust, memory-efficient stream operations.
