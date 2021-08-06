# UDP RCON

This node module lets you communicate with a server through the UDP RCON protocol.

## Install module

```
npm install @hidev/udp-rcon
```


## Import module

```js
import { UDP_RCON } from "@hidev/udp-rcon";
```


## Full example

```js
import { UDP_RCON } from "@hidev/udp-rcon";

// RCON configuration
const server_ip = "ENTER_RCON_IP_HERE";
const rcon_port = "ENTER_RCON_PORT_HERE";
const rcon_password = "ENTER_RCON_PASSWORD_HERE";
let my_rcon = new UDP_RCON(server_ip, rcon_port, rcon_password);

const rcon_success = (msg) => {
  console.log("Message received:", msg);
};

const rcon_error = (err) => {
  console.log(`Error: \n${err.stack}`);
};

// Commands
let rcon_instance = my_rcon.send("say Hello!", rcon_success, rcon_error);
```


## Build module

```
npm run build
```


## Structure

* lib : Built code
* src : Source code


## Functionalities

### Define a new RCON connection

```js
let my_rcon = new UDP_RCON(ip, port, password);
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

Made by Baptiste Miquel for HiDEV under the MIT license.