const cron = require("node-cron");
const Member = require("../models/Member");
const { sendWhatsapp } = require("./whatsapp");

cron.schedule("0 9 * * *", async () => {

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

    const message = `Hi ${member.name},

Your gym membership will expire on ${member.expiryDate.toDateString()}.

Please renew your membership.

Gym Team 💪`;

    try {

      // ✅ MEMBER KO MESSAGE
      await sendWhatsapp(member.phone, message);

      console.log(`✅ Message sent to ${member.name}`);

      // ✅ OWNER KO MESSAGE (ADD THIS 🔥)
      await sendWhatsapp(
  process.env.OWNER_PHONE,
  `🔔 Membership Expiry Alert

Member Name: ${member.name}
Phone: ${member.phone}

Expiry Date: ${new Date(member.expiryDate).toDateString()}

Please follow up with the member for renewal.

— Gym Management System`
);

      console.log("✅ Owner notified");

    } catch (error) {
      console.log("❌ Message failed:", error.message);
    }

  }

});