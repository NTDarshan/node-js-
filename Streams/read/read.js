//Readable streams

// Import the Node.js file system promises module for file operations
const fs = require("node:fs/promises");

// Create an immediately invoked async function to use await syntax
(async () => {
  // Open source file 'scr.txt' in read mode
  const filehandleRead = await fs.open("scr.txt", "r");
  // Open destination file 'dest.txt' in write mode
  const filehandleWrite = await fs.open("dest.txt", "w");

  // Create a readable stream with a buffer size of 64KB (64 * 1024 bytes)
  const streamRead = filehandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  // Create a writable stream for the destination file
  const streamWrite = filehandleWrite.createWriteStream();

  // Initialize split variable to handle numbers that might be split across chunks
  let split = " ";

  // Event listener for when data is available to read
  streamRead.on("data", (chunk) => {
    // Convert buffer to string and split by double spaces
    const number = chunk.toString("utf-8").split("  ");

    // Check if first number in current chunk connects with previous chunk
    if (Number(number[0]) != Number(number[1]) - 1) {
      // If there's a split number from previous chunk, combine it
      if (split) number[0] = split.trim() + number[0].trim();
    }

    // Check if last number in current chunk is incomplete
    if (
      Number(number[number.length - 2]) + 1 !==
      Number(number[number.length - 1])
    ) {
      // Store the incomplete number for next chunk
      split = number.pop();
    }

    // Process each number in the chunk
    number.forEach((num) => {
      let n = Number(num);

      // If number is even, write it to destination file
      if (n % 2 === 0) {
        // If write buffer is full, pause reading
        if (!streamWrite.write(" " + n + " ")) {
          streamRead.pause();
        }
      }
    });

    // Write the entire chunk, if buffer is full, pause reading
    if (!streamWrite.write(chunk)) {
      streamRead.pause();
    }

    // When write buffer is drained, resume reading
    streamWrite.on("drain", () => {
      streamRead.resume();
    });
  });
})();
