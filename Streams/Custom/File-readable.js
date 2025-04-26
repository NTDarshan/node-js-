//implementation of our own writable stream
const { Writable } = require("stream");

class MyWritable extends Writable {
  constructor(options) {
    super(options);
    this.fileName = options.fileName;
    this.fd = null;
  }

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

  _read(size) {
    let buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) this.destroy(err);
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        if (err) callback(err);
        else callback();
      });
    } else {
      callback();
    }
  }
}

const myWritable = new MyWritable({ fileName: "example.txt" });

myWritable.on("data", (chunk) => {
  console.log(chunk.toString());
});

myWritable.on("end", () => {
  console.log("End of file");
});
