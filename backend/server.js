const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const { startBiometricSync } = require("./services/biometricService");

require("./services/expiryReminder");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
 app.use("/api/biometric",require("./routes/biometricRoutes"))

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);

  // biometric service start
  startBiometricSync()

});