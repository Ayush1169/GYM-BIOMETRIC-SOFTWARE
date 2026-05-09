const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({

  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member"
  },

  name: String,
  phone: String,

  planType: String,

  originalAmount: Number,

  discount: {
    type: Number,
    default: 0
  },

  finalAmount: Number,

  gstPercent: {
    type: Number,
    default: 18
  },

  gstAmount: Number,

  totalAmount: Number,

  paymentMethod: String,

  paymentDate: {
    type: Date,
    default: Date.now
  },

  invoiceNumber: String

});

module.exports = mongoose.model("Invoice", invoiceSchema);