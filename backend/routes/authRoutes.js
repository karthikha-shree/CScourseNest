const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// ✅ Store Hashed Password Instead of Plain Text
const ADMIN_EMAIL = "kh001@example.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("kh001", 10); // Pre-hash once & use this

// ✅ Admin Login Route
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "❌ Invalid Email" });
  }

  // ✅ Correct Password Comparison
  const isMatch = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ message: "❌ Invalid Password" });
  }

  // ✅ Generate Token with JWT_SECRET from `.env`
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });

  res.json({ message: "✅ Login Successful", token });
});

module.exports = router;
