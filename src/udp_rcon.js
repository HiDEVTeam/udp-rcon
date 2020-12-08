// UDP RCON

const dgram = require("dgram");

class UDP_RCON {
  constructor(_ip, _port, _password, _game = null) {
    this.ip = _ip;
    this.port = _port;
    this.password = _password;
    this.game = _game;
  }
  send(cmd, success_cb = null, error_cb = null) {
    // Set a new events instance
    let udp_instance = new UDP_INSTANCE();
    success_cb && udp_instance.client.setEvent("message", success_cb);
    error_cb && udp_instance.client.setEvent("error", error_cb);

    // Create RCON buffer
    let buffer = this.initBuffer(cmd);

    return this.sendUDPSocket(buffer, cmd, udp_instance);
  }
  initBuffer(data) {

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
  sendUDPSocket(buffer, cmd, udp_instance) {
    const client = dgram.createSocket("udp4");

    client.on("error", (err) => {
      client.close();
      udp_instance.client.callEvent("error", err);
    });

    client.on("message", (msg, rinfo) => {
      const slicedMsg = msg.slice(4); // Remove first 4 bytes
      client.close();
      udp_instance.client.callEvent("message", slicedMsg.toString());
    });

    client.on("listening", () => {
      const address = client.address();
      udp_instance.client.callEvent("listening", address);
    });

    // Send to RCON
    client.connect(this.port, this.ip, (err) => {
      err && udp_instance.sender.callEvent("error", err);
      udp_instance.sender.callEvent("connect");
      client.send(buffer, (err) => {
        udp_instance.sender.callEvent("sended", buffer);
        err && udp_instance.sender.callEvent("error", err);
      });
    });
    return udp_instance;
  }
  setGame(game) {
    this.game = game;
  }
}

class UDP_INSTANCE {
  constructor() {
    this.sender = new UDP_SENDER();
    this.client = new UDP_CLIENT();
  }
}

class UDP_EVENTS_MANAGER {
  constructor() {
    this.events = {};
  }
  setEvent(name, event) {
    this.events[name] = event;
  }
  callEvent(name, args = null) {
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

exports.CONNECT = UDP_RCON;
