// ========== TCP CHAT CLIENT IMPLEMENTATION ==========

// Import the built-in 'net' module which provides network functionality in Node.js
// This module allows us to create TCP connections to servers
const net = require("net");

// Import the readline/promises module for handling user input asynchronously
// The promises version allows us to use async/await with readline for cleaner code
const readline = require("readline/promises");

// Create a readline interface for interactive command line input/output
// This allows us to prompt the user for messages and receive their input
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout, // Write to standard output (console)
});

// ========== TERMINAL CONTROL FUNCTIONS ==========

// Helper function to clear a line in the terminal
// This is used to create a cleaner chat interface by removing old input prompts
// Parameters:
// - dir: Direction to clear (0 = entire line, 1 = right of cursor, -1 = left of cursor)
// Returns a Promise that resolves when the line is cleared
const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

// Helper function to move the cursor in the terminal
// This is used to position the cursor for clearing lines and writing new content
// Parameters:
// - dx: Number of columns to move horizontally (negative = left, positive = right)
// - dy: Number of rows to move vertically (negative = up, positive = down)
// Returns a Promise that resolves when the cursor has moved
const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

// Variable to store the client's ID assigned by the server
// This ID is used to identify this client when sending messages
let id;

// ========== CLIENT CONNECTION SETUP ==========

// Create a new TCP connection to the server
// Parameters:
// - host: 127.0.0.1 (localhost - connecting to a server on the same machine)
// - port: 3008 (the TCP port number the server is listening on)
// The callback function is executed when the connection is successfully established
const socket = net.createConnection(
  { host: "127.0.0.1", port: 3008 },
  async () => {
    // This code runs once the connection is established
    console.log("Connected to the server!");

    // ========== MESSAGE INPUT FUNCTION ==========

    // Function to prompt the user for a message and send it to the server
    // This function is called repeatedly to create a continuous chat experience
    const ask = async () => {
      // Prompt the user for a message and await their input
      const message = await rl.question("Enter a message > ");

      // Move the cursor one line up to the line with the input prompt
      await moveCursor(0, -1);

      // Clear the current line that contains the input prompt
      // This creates a cleaner chat interface by removing old prompts
      await clearLine(0);

      // Send the message to the server with the format: "{id}-message-{message}"
      // This format allows the server to identify who sent the message
      socket.write(`${id}-message-${message}`);
    };

    // Start the conversation by asking for the first message
    ask();

    // ========== MESSAGE RECEIVING HANDLER ==========

    // Register an event handler for incoming data from the server
    // This executes whenever the server sends data to this client
    socket.on("data", async (data) => {
      // Print an empty line to create space for the incoming message
      console.log();

      // Move the cursor one line up
      await moveCursor(0, -1);

      // Clear the line that the cursor just moved into
      // This ensures clean formatting of incoming messages
      await clearLine(0);

      // Convert the received data to a UTF-8 string for processing
      // Check if this is an ID assignment message (starts with "id")
      if (data.toString("utf-8").substring(0, 2) === "id") {
        // When we are receiving our client ID from the server

        // Extract the ID value (everything after "id-")
        id = data.toString("utf-8").substring(3);

        // Display the assigned ID to the user
        console.log(`Your id is ${id}!\n`);
      } else {
        // When we are receiving a chat message from the server

        // Display the message to the user
        // The server formats messages as "> User {id}: {message}"
        console.log(data.toString("utf-8"));
      }

      // Prompt for the next message after processing the received data
      ask();
    });
  }
);

// ========== CONNECTION END HANDLER ==========

// Register an event handler for when the server closes the connection
// The 'end' event is emitted when the server ends the connection
socket.on("end", () => {
  // Notify the user that the connection has been closed
  console.log("Connection was ended!");

  //  close the readline interface
  rl.close();
});
