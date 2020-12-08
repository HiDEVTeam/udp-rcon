# UDP RCON

This node module lets you communicate with a server through the UDP RCON protocol.

## Build module

```
npm run build
```

## Import module

```js
const { UDP_RCON } = require("../dist/bundle");
```

## Structure

* dist : Built code
* src : Source code

## Functionalities

### Define a new RCON connection

```js
let my_rcon = new UDP_RCON.CONNECT(ip, port, password);
```

### Send a command

```js
my_rcon.send("say Test");
```

### Send a command with callbacks

```js
// Called on success => When a message is received
const success = (msg) => {
  console.log("Message received:", msg);
};

// Called on error with the connection
const error = (err) => {
  console.log(`Error: \n${err.stack}`);
};

my_rcon.send("say Test", success, error);
```

### Custom events

UDP RCON lets you use custom events:

```js
let rcon_instance = my_rcon.send("say Test");
rcon_instance.sender.setEvent("connect", () => {
  console.log(`Connection established with ${my_rcon.ip}:${my_rcon.port}`);
});
```

All events possible:

```js
// When connected to the RCON server
rcon_instance.sender.setEvent("connect", () => {});

// When message sended
rcon_instance.sender.setEvent("sended", (buffer) => {});

// When error occured while connecting to RCON
rcon_instance.sender.setEvent("error", (err) => {});

// When client is listening for response
rcon_instance.client.setEvent("listening", (address) => {});

// Overwrite rcon_success => When a message is received
rcon_instance.client.setEvent("message", (msg) => {});

// Overwrite rcon_error => When an error occured with the message received
rcon_instance.client.setEvent("error", (err) => {});
```

## Author

Made by Baptiste Miquel for HiDEV.