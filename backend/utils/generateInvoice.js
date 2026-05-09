const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (invoice) => {

  return new Promise((resolve, reject) => {

    const invoicesDir =
      path.join(__dirname, "../invoices");

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(
      invoicesDir,
      `${invoice.invoiceNumber}.pdf`
    );

    const doc = new PDFDocument({
      margin: 40
    });

    const stream =
      fs.createWriteStream(filePath);

    doc.pipe(stream);

    // HEADER

    doc
      .fontSize(24)
      .text("TAX INVOICE", {
        align: "center"
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .text("PRO PHYSIQUE GYM", {
        align: "center"
      });

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .text(
        "Raigarh, Chhattisgarh",
        {
          align: "center"
        }
      );

    doc.moveDown();

    doc.text(
      `GSTIN: 22RYGPS5561H1ZT`,
      {
        align: "center"
      }
    );

    doc.moveDown(2);

    // INVOICE INFO

    doc.fontSize(13);

    doc.text(
      `Invoice No: ${invoice.invoiceNumber}`
    );

    doc.text(
      `Invoice Date: ${new Date(
        invoice.paymentDate
      ).toDateString()}`
    );

    doc.moveDown();

    // MEMBER DETAILS

    doc.fontSize(15)
      .text("Member Details");

    doc.moveDown(0.5);

    doc.fontSize(12);

    doc.text(`Name: ${invoice.name}`);

    doc.text(`Phone: ${invoice.phone}`);

    doc.text(`Plan: ${invoice.planType}`);

    doc.text(
      `Payment Method: ${invoice.paymentMethod}`
    );

    doc.moveDown(2);

    // BILL TABLE

    doc.fontSize(15)
      .text("Billing Details");

    doc.moveDown();

    doc.fontSize(12);

doc.text(
  `Original Amount: Rs. ${Number(invoice.originalAmount).toFixed(2)}`
);

doc.text(
  `Discount: ${invoice.discount}%`
);

doc.text(
  `Amount After Discount: Rs. ${Number(invoice.finalAmount).toFixed(2)}`
);

doc.text(
  `GST (${invoice.gstPercent}%): Rs. ${Number(invoice.gstAmount).toFixed(2)}`
);

    doc.moveDown();

   doc
  .fontSize(18)
  .text(
    `TOTAL: Rs. ${Number(invoice.totalAmount).toFixed(2)}`,
    {
      align: "right"
    }
  );

    doc.moveDown(4);

    doc
      .fontSize(12)
      .text(
        "Authorized Signature",
        {
          align: "right"
        }
      );

    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", reject);

  });

};

module.exports = generateInvoice;