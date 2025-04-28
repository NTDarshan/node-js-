//simple tcp server : tcp = transmission control protocol
const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(data.toString("utp-8"));
  });
});

server.listen(8080, "192.168.0.125", () => {
  console.log("Server is running on port 8080", server.address());
});
