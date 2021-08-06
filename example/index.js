// Example of communication with a FiveM server

import { UDP_RCON } from "@hidev/udp-rcon";

// RCON configuration
const server_ip = "ENTER_RCON_IP_HERE";
const rcon_port = "ENTER_RCON_PORT_HERE";
const rcon_password = "ENTER_RCON_PASSWORD_HERE";

// Define RCON connection
let my_rcon = new UDP_RCON(server_ip, rcon_port, rcon_password);

const rcon_success = (msg) => {
  console.log("Message received:", msg);
};

const rcon_error = (err) => {
  console.log(`Error: \n${err.stack}`);
};

// Commands
let rcon_instance1 = my_rcon.send("status", rcon_success, rcon_error);
let rcon_instance2 = my_rcon.send("say Hello!", rcon_success, rcon_error);

// Events

// Sender events

// When connected to the RCON server
rcon_instance1.sender.setEvent("connect", () => {
  console.log(`Connection established with ${my_rcon.ip}:${my_rcon.port}`);
});

// When message sended
rcon_instance1.sender.setEvent("sended", (buffer) => {
  console.log(buffer);
  console.log(
    "Waiting for server response... If no response, consider server is offline."
  );
});

// When error occured while connecting to RCON
rcon_instance1.sender.setEvent("error", (err) => {
  console.log("Error while connecting to RCON server", err);
});

// Client events

// When client is listening for response
rcon_instance1.client.setEvent("listening", (address) => {
  console.log(`Listening response on: ${address.address}:${address.port}`);
});

// Overwrite rcon_success => When a message is received
rcon_instance1.client.setEvent("message", rcon_success);

// Overwrite rcon_error => When an error occured with the message received
rcon_instance1.client.setEvent("error", rcon_error);
