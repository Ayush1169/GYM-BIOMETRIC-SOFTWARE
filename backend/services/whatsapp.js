const {
  Client,
  LocalAuth,
  MessageMedia
} = require("whatsapp-web.js");

const qrcode =
  require("qrcode-terminal");

let isReady = false;

const client = new Client({

  authStrategy:
    new LocalAuth(),

  puppeteer: {

    headless: true,

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]

  }

});

// QR
client.on("qr", (qr) => {

  console.log(
    "📱 Scan QR with WhatsApp"
  );

  qrcode.generate(qr, {
    small: true
  });

});

// READY
client.on("ready", () => {

  console.log(
    "✅ WhatsApp Bot Ready"
  );

  isReady = true;

});

// AUTH SUCCESS
client.on("authenticated", () => {

  console.log(
    "✅ WhatsApp Authenticated"
  );

});

// AUTH FAILURE
client.on("auth_failure", (msg) => {

  console.log(
    "❌ Auth Failed:",
    msg
  );

  isReady = false;

});

// DISCONNECT
client.on("disconnected", (reason) => {

  console.log(
    "⚠ WhatsApp disconnected:",
    reason
  );

  isReady = false;

});

// INIT
client.initialize();


// SEND NORMAL MESSAGE
const sendWhatsapp = async (
  phone,
  message
) => {

  try {

    if (!isReady) {

      console.log(
        "⚠ WhatsApp not ready"
      );

      return false;

    }

    const clean =
      phone.replace(/\D/g, "")
      .slice(-10);

    const chatId =
      `91${clean}@c.us`;

    await client.sendMessage(
      chatId,
      message
    );

    console.log(
      "✅ WhatsApp message sent"
    );

    return true;

  } catch (err) {

    console.log(
      "WhatsApp send error:",
      err.message
    );

    return false;

  }

};


// SEND PDF
const sendPdfWhatsapp = async (
  phone,
  filePath,
  caption = ""
) => {

  try {

    if (!isReady) {

      console.log(
        "⚠ WhatsApp not ready"
      );

      return false;

    }

    const clean =
      phone.replace(/\D/g, "")
      .slice(-10);

    const chatId =
      `91${clean}@c.us`;

    const media =
      MessageMedia.fromFilePath(
        filePath
      );

    await client.sendMessage(
      chatId,
      media,
      {
        caption
      }
    );

    console.log(
      "✅ PDF sent on WhatsApp"
    );

    return true;

  } catch (err) {

    console.log(
      "PDF send error:",
      err.message
    );

    return false;

  }

};

module.exports = {

  sendWhatsapp,
  sendPdfWhatsapp

};