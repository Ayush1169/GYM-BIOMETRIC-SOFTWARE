const ZKLib = require("node-zklib");

const zk = new ZKLib("192.168.1.9", 4370, 10000, 4000);

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