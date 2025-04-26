//Creating our own Streaming solution using buffers

// Import the Node.js file system promises module for asynchronous file operations
const fs = require("node:fs/promises");

// Create an immediately invoked async function to use await syntax
(async () => {
  // Open the source file in read mode and get its file handle
  const source = await fs.open("scr.txt", "r");
  // Open the destination file in write mode and get its file handle
  const destination = await fs.open("dest.txt", "w");

  // Initialize bytesRead to -1 to enter the while loop
  // Will be updated with actual bytes read in each iteration
  var bytesRead = -1;

  // Continue reading until we reach end of file (bytesRead becomes 0)
  while (bytesRead !== 0) {
    // Read a chunk from the source file
    // readResult contains: { bytesRead: number, buffer: Buffer }
    var readResult = await source.read();
    // Update bytesRead with the number of bytes read in this iteration
    bytesRead = readResult.bytesRead;

    // Check if we read less than the default buffer size (16384 bytes)
    // This typically happens at the end of the file
    if (bytesRead !== 16384) {
      // Find the position of the first null byte (0) in the buffer
      // This indicates where the actual data ends
      var fileNotRead = readResult.buffer.indexOf(0);
      // Create a new buffer that's exactly the size of the actual data
      var newBuffer = Buffer.alloc(fileNotRead);
      // Copy only the actual data from the original buffer to the new buffer
      // Parameters: (target buffer, target start, source start, source end)
      readResult.buffer.copy(newBuffer, 0, 0, fileNotRead);
      // Write the trimmed buffer to the destination file
      await destination.write(newBuffer);
    } else {
      // For full chunks (16384 bytes), write the entire buffer
      await destination.write(readResult.buffer);
    }
  }
})();
