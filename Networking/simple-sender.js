const net = require("net");

const socket = net.connect(
  {
    host: "192.168.0.125",
    port: 8080,
  },
  () => {
    socket.write("Hello from the client!");
  }
);
