//File Systems in node js
const fs = require("fs");
const content = fs.readFileSync("./content.txt", "utf-8");
console.log(content);

//different way to read file using fs module
//1) Promise api
const fs = require("fs").promises;
(async () => {
  try {
    await fs.copyFile("./content.txt", "./content-copy.txt");
  } catch (error) {
    console.log(error);
  }
})();

//2)callback api
const fs = require("fs");

fs.copyFile("./content.txt", "./content-copy.txt", (error) => {
  if (error) {
    console.log(error);
  }
});

//3)synchronous api
const fs = require("fs");
try {
  fs.copyFileSync("./content.txt", "./content-copy.txt");
  console.log("File copied successfully");
} catch (error) {
  console.log(error);
}
