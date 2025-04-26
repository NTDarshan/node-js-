//writin millions of bytes to a file

//using promise type
// const fs = require("node:fs/promises");
// const { console } = require("node:inspector");

// (async () => {
//   console.time("write many");
//   const fileHandle = await fs.open("test.txt", "w");

//   for (let i = 0; i < 10000; i++) {
//     await fileHandle.writeFile(`${i}`);
//   }

//   console.timeEnd("write many");
// })();

//using callback type

//writable stream
// Import the Node.js file system promises module
const fs = require("node:fs/promises");
// Import the console from Node.js inspector module for performance timing
const { console } = require("node:inspector");

// Create an immediately invoked async function
(async () => {
  // Start timing the write operation
  console.time("write many");

  // Open file 'test.txt' in write mode using callback pattern
  fs.open("test.txt", "w", (err, fd) => {
    // Handle any errors that occur during file opening
    if (err) throw err;

    // Write numbers from 0 to 9999 to the file
    for (let i = 0; i < 10000; i++) {
      // Write each number to the file using the file descriptor (fd)
      fs.write(fd, `${i}`, (err) => {
        // Handle any errors that occur during writing
        if (err) throw err;
      });
    }
  });

  // End timing and log the total duration
  console.timeEnd("write many");
})();
