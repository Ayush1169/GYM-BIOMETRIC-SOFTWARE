const cron = require("node-cron");
const Member = require("../models/Member");
const client = require("./whatsapp");

cron.schedule("*0 9 * * *", async () => {

  console.log("Checking memberships...");

  const today = new Date();
  const targetDate = new Date();

  targetDate.setDate(today.getDate() + 3);

  const members = await Member.find({
    expiryDate: {
      $lte: targetDate,
      $gte: today
    },
    isArchived: false
  });

  for (const member of members) {

    const phone = `91${member.phone}@c.us`;

    const message = `Hi ${member.name},

Your gym membership will expire on ${member.expiryDate.toDateString()}.

Please renew your membership.

Gym Team 💪`;

    try {

      await client.sendMessage(phone, message);

      console.log(`✅ Message sent to ${member.name} (${member.phone})`);

    } catch (error) {

      console.log("❌ Message failed:", error.message);

    }

  }

});