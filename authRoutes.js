const express = require("express");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email: email.toLowerCase().trim(), password });
    res.json({ token: generateToken(user), user });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(400).json({ message: err.message || "Error registering user" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const sanitizedEmail = email.toLowerCase().trim();
  console.log("Login attempt for:", sanitizedEmail);

  const user = await User.findOne({ email: sanitizedEmail });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: "Wrong password" });

  res.json({ token: generateToken(user), user });
});

module.exports = router;
