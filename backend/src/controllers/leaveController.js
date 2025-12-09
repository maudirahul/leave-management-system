const Leave = require("../models/leave");
const User = require("../models/user");

exports.applyLeave = async (req, res, next) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s)
      return res.status(400).json({ message: "endDate must be >= startDate" });
    const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    const leave = await Leave.create({
      user: req.user._id,
      startDate: s,
      endDate: e,
      days,
      reason,
    });
    res.status(201).json(leave);
  } catch (err) {
    next(err);
  }
};

exports.getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

exports.getAllPending = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ status: "pending" }).populate(
      "user",
      "name email"
    );
    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ message: "Not found" });
    leave.status = status;
    leave.comments = comments;
    leave.approver = req.user._id;
    await leave.save();

    // If approved, deduct from user's leave balance
    if (status === "approved") {
      const user = await User.findById(leave.user);
      user.leaveBalance.annual = Math.max(
        0,
        (user.leaveBalance.annual || 0) - leave.days
      );
      await user.save();
    }

    res.json(leave);
  } catch (err) {
    next(err);
  }
};
