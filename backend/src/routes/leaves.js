const express = require("express");
const app = express();
const leaveController = require("../controllers/leaveController");
const { auth, adminOnly } = require("../utils/authMiddleware");

app.post("/", auth, leaveController.applyLeave);
app.get("/", auth, leaveController.getMyLeaves);

// admin endpoints
app.get("/admin/pending", auth, adminOnly, leaveController.getAllPending);
app.put("/:id", auth, adminOnly, leaveController.updateLeaveStatus);

module.exports = app;
