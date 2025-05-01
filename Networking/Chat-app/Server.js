// ========== TCP SERVER IMPLEMENTATION ==========

// NET module provides the ability to create TCP and UDP servers and it provides an asynchronous API for handling network connections.
// TCP (Transmission Control Protocol) is a connection-oriented protocol that provides reliable and ordered delivery of data.
// It ensures that data packets are delivered in the correct order and without errors.

// Import the built-in 'net' module which provides network functionality in Node.js
const net = require("net");

// Array to store all connected client sockets
// This allows us to broadcast messages to all connected clients
const clients = [];

// Create a new TCP server instance
// net.createServer() returns a server object that can listen for connections
const server = net.createServer();

// ========== EVENT HANDLERS ==========

// Register an event handler for new client connections
// The 'connection' event is emitted whenever a new client connects to the server
// The callback receives a 'socket' object representing the connection to that specific client
server.on("connection", (socket) => {
  // Log when a new client connects to the server
  console.log("New connection to the server!");

  // Register an event handler for incoming data from this client
  // The 'data' event is emitted whenever the client sends data to the server
  socket.on("data", (data) => {
    // Broadcast the received message to all connected clients
    // This creates the chat functionality where messages from one client are sent to all others
    clients.map((client) => {
      // Uncomment the if condition below to prevent echoing messages back to the sender
      // if (client !== socket) {
      client.write(data);
      // }
    });
  });

  // Add the new client socket to our clients array for future broadcasts
  clients.push(socket);
});

// ========== SERVER STARTUP ==========

// Start the server and listen for connections on the specified port and host
// Parameters:
// - Port: 3008 (the TCP port number to listen on)
// - Host: 127.0.0.1 (localhost - only accepting connections from the same machine)
// - Callback: Function to execute when the server starts listening successfully
server.listen(3008, "127.0.0.1", () => {
  // Log server startup information including address details
  // server.address() returns an object with address, family, and port information
  console.log("Opened server on", server.address());
});
