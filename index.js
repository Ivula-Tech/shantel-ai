const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

let offlineModeActive = false;
let messageListener; 

client.on("message_create", (message, ack) => {
  if (
    message.body == "Start_Offline" &&
    message.to === "254741741381@c.us" &&
    message.from === "254741741381@c.us" &&
    message.author === "254741741381@c.us"
  ) {
    if (!offlineModeActive) {
      messageListener = (message) => {
        listeningMessage(message);
      };
      client.on("message", messageListener);
      offlineModeActive = true;
      console.log("Started offline mode");
      console.log("Listening for messages ...");
    }
  } else if (
    message.body == "Stop_Offline" &&
    message.to === "254741741381@c.us" &&
    message.from === "254741741381@c.us" &&
    message.author === "254741741381@c.us"
  ) {
    if (offlineModeActive) {
      client.removeListener("message", messageListener);
      offlineModeActive = false;
      console.log("Stopped offline mode");
    }
  }
});

const listeningMessage = (message) => {
  let senderType = message.from.split("@")[1];
  if (senderType == "c.us") {
    client.sendMessage(
      message.from,
      "Hi, this is Shantel, Shelton's AI assistant. I understand you're trying to reach Shelton. Kindly contact him in an hour's time. Thank you."
    );
  }
};

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Scan the QR code above with your WhatsApp app.");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();
