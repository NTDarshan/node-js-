const { Transform } = require("stream");
const fs = require("node:fs/promises");

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 255) chunk[i] = chunk[i] + 1;
    }
    this.push(chunk);
    callback();
  }
}

(async () => {
  const readFile = await fs.open("read.txt", "r");
  const writeFile = await fs.open("write.txt", "w");
  const readStream = readFile.createReadStream();
  const writeStream = writeFile.createWriteStream();

  const encrypt = new Encrypt();
  readStream.pipe(encrypt).pipe(writeStream);
})();
