// The EventEmitter is a core Node.js class that allows objects to emit named events
// and register listeners that execute when those events are emitted
const EventEmitter = require("events");

// Create an instance of EventEmitter
// This object will be used to both emit events and register listeners
const emitter = new EventEmitter();

// Register an event listener
// The 'on' method takes two arguments:
//   1. The event name to listen for ('messageLogged')
//   2. A callback function that will execute when the event is emitted
emitter.on("messageLogged", () => {
  console.log("Listener called 1 ");
});

emitter.on("messageLogged", () => {
  console.log("Listener called 2");
});

//once method is used to register a listener that will be called only once for the event
emitter.on("food", () => {
  console.log("food 1");
});

emitter.on("restuarent", (name) => {
  console.log(name);
});

// Raise/Emit an event
// The 'emit' method triggers the event and executes all registered listeners
// This line causes the callback function above to execute and log "Listener called"
emitter.emit("messageLogged");

emitter.emit("food");
emitter.emit("food");
emitter.emit("food");
emitter.emit("food");

emitter.emit("restuarent", "McDonald's");
emitter.emit("restuarent", "Pizza Hut");
