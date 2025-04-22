// File watcher implementation using Node.js fs/promises module
const fs = require("fs/promises");

(async () => {
  const createFile = async (path) => {
    try {
      const existingFile = await fs.open(path, "r");
      existingFile.close();
      return console.log("File already exists");
    } catch (error) {
      let newFile = await fs.open(path, "w");
      newFile.close();
      return console.log("File created");
    }
  };

  const deleteFile = async (path) => {
    try {
      const existingFile = await fs.open(path, "r");
      existingFile.close();
      await fs.unlink(path);
      return console.log("File deleted");
    } catch (error) {
      return console.log("File does not exist");
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      const existingFile = await fs.open(oldPath, "r");
      existingFile.close();
      await fs.rename(oldPath, newPath);
      return console.log("File renamed");
    } catch (error) {
      return console.log("File does not exist");
    }
  };

  const addToFile = async (path, content) => {
    try {
      const existingFile = await fs.open(path, "r");
      existingFile.close();
      await fs.appendFile(path, content);
      return console.log("Content added to file");
    } catch (error) {
      return console.log("File does not exist");
    }
  };

  const FILE_CREATE = "create a file";
  const FILE_DELETE = "delete the file";
  const FILE_RENAME = "rename the file";
  const FILE_CONTENT = "Add to the file";
  // Open the command file for reading operations
  // This creates a file handle that we can use for multiple operations
  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
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
    const position = 0;

    // Read the file content into the buffer
    // This returns an object with bytesRead and buffer properties
    await commandFileHandler.read(
      buff, // The buffer to write data into
      offset, // The starting position in the buffer
      length, // Number of bytes to read
      position // Position in the file to start reading from
    );

    // Log the result of the read operation
    // Note: This logs the read operation result object, not the actual file content
    // To see the file content, use: console.log(buff.toString())
    const command = buff.toString("utf-8");

    if (command.includes(FILE_CREATE)) {
      const filePath = command.substring(FILE_CREATE.length + 1).trim();
      await createFile(filePath);
    } else if (command.includes(FILE_DELETE)) {
      const filePath = command.substring(FILE_DELETE.length + 1).trim();
      await deleteFile(filePath);
    } else if (command.includes(FILE_RENAME)) {
      const index = command.indexOf(" to ");
      const oldPath = command.substring(FILE_RENAME.length + 1, index).trim();
      const newPath = command.substring(index + 4).trim();
      await renameFile(oldPath, newPath);
    } else if (command.includes(FILE_CONTENT)) {
      const index = command.indexOf(" this content: ");
      const filePath = command.substring(FILE_CONTENT.length + 1, index).trim();
      const content = command.substring(index + 18).trim();
      await addToFile(filePath, content);
    }
  });

  // Create a watcher to monitor changes to the command.txt file
  // This will emit events whenever the file is modified
  const watcher = fs.watch("./command.txt");
  // Iterate through events emitted by the watcher using for-await loop
  for await (const event of watcher) {
    // Check if the event is a file modification event
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
