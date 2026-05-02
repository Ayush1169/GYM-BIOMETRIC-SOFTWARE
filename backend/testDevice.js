const ZKLib = require("node-zklib");
require("dotenv").config();

const zk = new ZKLib(
  process.env.DEVICE_IP,
  Number(process.env.DEVICE_PORT),
  10000,
  4000
);

async function test() {
  try {

    await zk.createSocket();

    console.log("✅ Device connected");

    const info = await zk.getInfo();

    console.log("Device Info:", info);

    await zk.disconnect();

  } catch (e) {

    console.log("Error:", e);

  }
}

test();