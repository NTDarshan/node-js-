// ========== TCP CHAT SERVER IMPLEMENTATION ==========

// Import the built-in 'net' module which provides network functionality in Node.js
// This module allows us to create TCP servers and handle client connections
const net = require("net");

// Create a new TCP server instance without any initial connection listener
// We'll add the connection listener separately using the .on() method
const server = net.createServer();

// Array to store all connected client objects
// Each client object will contain the client's ID and socket connection
const clients = [];

// ========== CONNECTION HANDLER ==========

// Register an event handler for new client connections
// This callback executes whenever a new client connects to the server
server.on("connection", (socket) => {
  // Log a message when a new client connects
  console.log("A new connection to the server!");

  // Generate a unique ID for this client based on the current number of clients
  // This simple approach works for demonstration but has limitations in production:
  // - IDs are not truly unique if clients disconnect and reconnect
  // - IDs are sequential and predictable
  const clientId = clients.length + 1;

  // ========== JOIN NOTIFICATION ==========

  // Broadcast a message to all connected clients announcing the new user
  // This lets everyone in the chat know when someone new joins
  clients.map((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  // Send the client their assigned ID
  // The client will use this ID to identify itself in future messages
  // Format: "id-{clientId}" which the client code will parse
  socket.write(`id-${clientId}`);

  // ========== MESSAGE HANDLING ==========

  // Register an event handler for incoming data from this client
  // This executes whenever this specific client sends a message
  socket.on("data", (data) => {
    // Convert the received binary data to a UTF-8 string
    const dataString = data.toString("utf-8");

    // Parse the message format which should be: "id-message-{actual message}"
    // Extract the client ID from the beginning of the message
    const id = dataString.substring(0, dataString.indexOf("-"));

    // Extract the actual message content after the "-message-" marker
    const message = dataString.substring(dataString.indexOf("-message-") + 9);

    // Broadcast the message to all connected clients
    // Format: "> User {id}: {message}" to identify who sent the message
    clients.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  // ========== DISCONNECT HANDLING ==========

  // Register an event handler for when this client disconnects
  // The 'end' event is emitted when the client closes the connection
  socket.on("end", () => {
    // Broadcast a message to all remaining clients that this user has left
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  // Add the new client to our clients array with their ID and socket
  // The socket object represents the connection to this specific client
  clients.push({ id: clientId.toString(), socket });
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
  console.log("opened server on", server.address());
});
