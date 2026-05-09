const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const generateInvoice = require("../utils/generateInvoice");
const {
  sendPdfWhatsapp
} = require("../services/whatsapp");

router.post("/", async (req, res) => {

  try {

    const {
      memberId,
      name,
      phone,
      planType,
      originalAmount,
      discount,
      finalAmount,
      paymentMethod
    } = req.body;

    const gstPercent = 5;

    const gstAmount =
      (finalAmount * gstPercent) / 100;

    const totalAmount =
      finalAmount + gstAmount;

    const invoice = await Invoice.create({

      memberId,
      name,
      phone,
      planType,

      originalAmount,

      discount,

      finalAmount,

      gstPercent,

      gstAmount,

      totalAmount,

      paymentMethod,

      invoiceNumber:
        "INV-" + Date.now(),

      paymentDate: new Date()

    });

    const filePath =
      await generateInvoice(invoice);

      await sendPdfWhatsapp(

  process.env.OWNER_PHONE,

  filePath,

  `🏋️ Gym Invoice Generated

Member: ${invoice.name}

Invoice No:
${invoice.invoiceNumber}

Total Amount:
₹${invoice.totalAmount}`

);

    res.download(filePath);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Invoice generation failed"
    });

  }

});

module.exports = router;