const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config({ path: "../.env" });

const authRoutes = require("./routes/auth");
const leaveRoutes = require("./routes/leaves");

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log("Server running on", PORT));
  })
  .catch((err) => console.error(err));
