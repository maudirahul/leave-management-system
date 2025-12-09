// seed simple users
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await User.create({
    name: "Admin User",
    email: "admin@company.com",
    password:"admin123",
    role: "admin",
    leaveBalance: { annual: 30, casual: 10 },
  });
  await User.create({
    name: "Test User",
    email: "user@company.com",
    password:"user123",
    role: "user",
    leaveBalance: { annual: 12, casual: 5 },
  });
  console.log("Seeded");
  process.exit(0);
}
seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
