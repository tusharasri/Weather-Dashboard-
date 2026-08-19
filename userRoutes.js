const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// get logged in user
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

// add favorite
router.post("/favorites", protect, async (req, res) => {
  req.user.favorites.push(req.body.city);
  await req.user.save();
  res.json(req.user.favorites);
});

// remove favorite
router.delete("/favorites/:city", protect, async (req, res) => {
  req.user.favorites = req.user.favorites.filter(c => c !== req.params.city);
  await req.user.save();
  res.json(req.user.favorites);
});

// update preferences
router.put("/preferences", protect, async (req, res) => {
  const { unit, theme } = req.body;
  if (unit) req.user.preferences.unit = unit;
  if (theme) req.user.preferences.theme = theme;
  await req.user.save();
  res.json(req.user.preferences);
});

// update profile (name)
router.put("/profile", protect, async (req, res) => {
  const { name } = req.body;
  if (name) req.user.name = name;
  await req.user.save();
  res.json(req.user);
});

module.exports = router;
