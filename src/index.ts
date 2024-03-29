import { EventReturn, EventCallback, Events } from "./types";
const dgram = require("dgram");

export interface UDP_RCON {
  /**
 * Send a command to the RCON server
 * @param cmd The command to send
 * @param success_cb The callback to execute on success
 * @param error_cb The callback to execute on error
 * @returns An instance of the UDP client socket that can be used to call custom events on
 */
  send(cmd: string, success_cb?: EventCallback, error_cb?: EventCallback): UDP_INSTANCE;
}

export interface UDP_INSTANCE {
  /**
   * Events that are triggered when sending the event
   */
  sender: UDP_SENDER;
  /**
   * Events that are triggered when receiving the event
   */
  client: UDP_CLIENT;
}

export interface UDP_EVENTS_MANAGER {
  /**
   * The list of events that can be triggered
   */
  events: Events;
  /**
   * Set a new event defined by a name and a callback
   */
  setEvent(name: string, event: EventCallback): void;
  /**
   * Call a specific event by its name
   */
  callEvent(name: string, args?: EventReturn): void;
}

export class UDP_RCON {
  ip: string;
  port: string;
  password: string;

  constructor(_ip: string, _port: string, _password: string) {
    this.ip = _ip;
    this.port = _port;
    this.password = _password;
  }

  public send(cmd: string, success_cb?: EventCallback, error_cb?: EventCallback): UDP_INSTANCE {
    // Set a new events instance
    let udp_instance = new UDP_INSTANCE();
    success_cb && udp_instance.client.setEvent("message", success_cb);
    error_cb && udp_instance.client.setEvent("error", error_cb);

    // Create RCON buffer
    let buffer = this.initBuffer(cmd);

    return this.sendUDPSocket(buffer, udp_instance);
  }

  private initBuffer(data: string): Buffer {

    // TODO: Challenge token

    let socketData = `rcon ${this.password} ${data}`;

    const dataLength = Buffer.byteLength(socketData);

    // Set and allocate buffer size
    const bufferSize = dataLength + 0x06; // 32 bits length + 16 bits empty string => 6 bytes
    const buffer = Buffer.alloc(bufferSize);

    // Write buffer
    // Endianness not important here
    buffer.writeUInt32LE(0xffffffff, 0x00);
    buffer.write(socketData, 0x04);
    buffer.writeInt16LE(0x00, bufferSize - 0x02);

    // console.log(buffer);
    // <Buffer ff ff ff ff 72 63 6f 6e 20 70 61 73 73 77 72 64 20 73 61 79 20 42 6f 6e 6a 6f 75 72 21 00 00>

    return buffer;
  }

  private sendUDPSocket(buffer: Buffer, udp_instance: UDP_INSTANCE): UDP_INSTANCE {
    const clientSocket = dgram.createSocket("udp4");

    clientSocket.on("error", (err: string) => {
      clientSocket.close();
      udp_instance.client.callEvent("error", err);
    });

    clientSocket.on("message", (msg: string) => {
      const slicedMsg = msg.slice(4); // Remove first 4 bytes
      clientSocket.close();
      udp_instance.client.callEvent("message", slicedMsg.toString());
    });

    clientSocket.on("listening", () => {
      const address = clientSocket.address();
      udp_instance.client.callEvent("listening", address);
    });

    // Send to RCON
    clientSocket.send(buffer, this.port, this.ip, (err: string) => {
      udp_instance.sender.callEvent("connect");
      udp_instance.sender.callEvent("sended", buffer);
      err && udp_instance.sender.callEvent("error", err);
    });

    return udp_instance;
  }
}

export class UDP_INSTANCE {
  sender: UDP_SENDER;
  client: UDP_CLIENT;

  constructor() {
    this.sender = new UDP_SENDER();
    this.client = new UDP_CLIENT();
  }
}

export class UDP_EVENTS_MANAGER {
  events: Events;

  constructor() {
    this.events = {};
  }

  setEvent(name: string, event: EventCallback) {
    this.events[name] = event;
  }

  callEvent(name: string, args?: EventReturn) {
    this.events[name] && this.events[name](args);
  }

}

class UDP_SENDER extends UDP_EVENTS_MANAGER {
  constructor() {
    super();
  }
}

class UDP_CLIENT extends UDP_EVENTS_MANAGER {
  constructor() {
    super();
  }
}