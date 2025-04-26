// Import the Writable stream class from Node.js core streams module
const { Writable } = require("node:stream");
const fs = require("node:fs");
/**
 * Custom Writable Stream implementation
 * Extends the Node.js Writable stream class to create our own writable stream
 */
class MyWritable extends Writable {
  /**
   * Constructor for our custom writable stream
   * @param {Object} options - Configuration options for the writable stream
   * @param {number} options.highWaterMark - Maximum internal buffer size before backpressure is applied
   * @param {boolean} options.objectMode - Whether stream should operate in object mode instead of Buffer/String
   * @param {boolean} options.decodeStrings - Whether to decode strings into Buffers before writing
   * @param {AbortSignal} options.signal - AbortSignal to abort ongoing operations
   * @param {boolean} options.autoDestroy - Whether to automatically call destroy() on stream completion
   * @param {Function} options.start - Function called when stream is constructed
   * @param {Function} options.destroy - Custom implementation for stream destruction
   * @param {Function} options.final - Function called before stream closes
   * @param {Function} options.writev - Bulk write implementation for performance optimization
   */
  constructor({
    highWaterMark,
    objectMode,
    decodeStrings,
    signal,
    autoDestroy,
    start,
    destroy,
    final,
    writev,
    fileName,
  }) {
    // Call parent constructor with highWaterMark option
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.numberOfWrites = 0;
  }

  /**
   * Internal method that is called by the Writable stream when write() is called
   * This is where the actual writing logic is implemented
   *
   * @param {Buffer|string} chunk - The data to be written
   * @param {string} encoding - The encoding of the data if chunk is a string
   * @param {Function} callback - Function to call when processing is complete
   *                             Call with error to signal failure, or with no args to signal success
   */

  /**
   * Internal initialization method for Writable streams
   * Called before any writes occur, allowing for async setup operations
   *
   * @param {Function} callback - Function to call when initialization is complete
   *                             Call with error to signal failure, or with no args to signal success
   */
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize >= this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }

        this.chunks = [];
        this.chunkSize = 0;
        ++this.numberOfWrites;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    if (this.chunks.length > 0) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          callback(err);
        } else {
          this.chunks = [];
          callback();
        }
      });
    }
  }

  _destroy(err, callback) {
    console.log("Number of writes: ", this.numberOfWrites);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
    } else {
      callback(err);
    }
  }
}

// Create an instance of our custom writable stream
const myWritable = new MyWritable({
  highWaterMark: 1800,
  fileName: "text.txt",
});

// Write data to our stream - this will trigger the _write method
myWritable.write(Buffer.from("Hello, world!"));

// Signal that no more data will be written
// This is important to properly close streams and release resources
myWritable.end("This is the End");

// Listen for the 'finish' event to know when all data has been written
myWritable.on("finish", () => {
  console.log("All data has been written!");
});
