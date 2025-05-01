// ========== TCP CLIENT IMPLEMENTATION ==========

// Import the built-in 'net' module which provides network functionality in Node.js
const net = require("net");

// Import the readline/promises module for handling user input asynchronously
// The promises version allows us to use async/await with readline
const readline = require("readline/promises");

// Create a readline interface for interactive command line input/output
// This allows us to prompt the user for messages and receive their input
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout, // Write to standard output (console)
});

// ========== CLIENT CONNECTION SETUP ==========

// Create a new TCP connection to the server
// Parameters:
// - host: 127.0.0.1 (localhost - connecting to a server on the same machine)
// - port: 3008 (the TCP port number the server is listening on)
// The callback function is executed when the connection is successfully established
const client = net.createConnection(
  { host: "127.0.0.1", port: 3008 },
  async () => {
    // This code runs once the connection is established

    // Prompt the user to enter a message
    const message = await rl.question("Enter a message: ");

    // Send the user's message to the server
    client.write(message);

    // Note: In a real chat application, you would typically want to:
    // 1. Keep prompting for new messages in a loop
    // 2. Allow the user to exit gracefully
    // 3. Handle connection errors
  }
);

// ========== EVENT HANDLERS ==========

// Register an event handler for incoming data from the server
// The 'data' event is emitted whenever the server sends data to this client
client.on("data", (data) => {
  // Convert the received binary data to a UTF-8 string and display it
  console.log(data.toString("utf8"));
});

// Register an event handler for when the server closes the connection
// The 'end' event is emitted when the server ends the connection
client.on("end", () => {
  // Notify the user that the connection has been closed
  console.log("connection closed");

  // Note: You might want to also close the readline interface here
  // rl.close();
});
