const { Transform } = require("stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 255) chunk[i] = chunk[i] - 1;
    }
    this.push(chunk);
    callback();
  }
}

(async () => {
  const readFile = await fs.open("write.txt", "r");
  const writeFile = await fs.open("descrypt.txt", "w");
  const readStream = readFile.createReadStream();
  const writeStream = writeFile.createWriteStream();

  const decrypt = new Decrypt();

  // Pipe the read stream through the transform stream to the write stream
  readStream.pipe(decrypt).pipe(writeStream);
})();
