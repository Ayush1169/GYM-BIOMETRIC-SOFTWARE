const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  phone: String,
  age: Number,

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "male"
  },
  
  fingerprintId: {
    type: String,
    unique: true,
    sparse: true, // Isse null values allow honge
  },

  planType: String,
  startDate: Date,
  expiryDate: Date,

  isArchived: {
  type: Boolean,
  default: false,
},

  price:{
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },

},
 {timestamps: true}
);

module.exports = mongoose.model("Member", memberSchema);
