const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

exports.login = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  // accept any email that exists in DB and return JWT
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: "User not found" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};
