// File watcher implementation using Node.js fs/promises module
const fs = require("fs/promises");

(async () => {
  // Open the command file for reading operations
  // This creates a file handle that we can use for multiple operations
  const commandFileHandler = await fs.open("./command.txt");

  // Create a watcher to monitor changes to the command.txt file
  // This will emit events whenever the file is modified
  const watcher = fs.watch("./command.txt");

  // Iterate through events emitted by the watcher using for-await loop
  for await (const event of watcher) {
    // Check if the event is a file modification event
    if (event.eventType === "change") {
      console.log("File has beena changed!");

      // Get the current size of the file to allocate appropriate buffer
      const { size } = await commandFileHandler.stat();

      // Define the starting position in the buffer where data will be written
      const offset = 0;

      // Create a buffer with size equal to the file size to store file contents
      const buff = Buffer.alloc(size);

      // Define how many bytes to read from the file
      const length = buff.byteLength;

      // Define the position in the file from where to start reading
      // Note: Using 'length' here means starting at the end of file, which may not read any data
      // Consider using position = 0 to read from the beginning of the file
      const position = length;

      // Read the file content into the buffer
      // This returns an object with bytesRead and buffer properties
      const content = await commandFileHandler.read(
        buff, // The buffer to write data into
        offset, // The starting position in the buffer
        length, // Number of bytes to read
        position // Position in the file to start reading from
      );

      // Log the result of the read operation
      // Note: This logs the read operation result object, not the actual file content
      // To see the file content, use: console.log(buff.toString())
      console.log(content);
    }
  }
})();
