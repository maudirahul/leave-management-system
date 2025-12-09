const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", LeaveSchema);
