const express = require("express");
const axios = require("axios");
const protect = require("../middleware/authMiddleware");
const { sendToQueue } = require("../services/mqService");

const router = express.Router();

router.get("/forecast/:city", protect, async (req, res) => {
  const city = req.params.city;
  const unit = req.query.unit || 'metric';

  if (req.user.role !== 'premium') {
    return res.status(403).json({ message: "Premium subscription required for 5-day forecast" });
  }

  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=${unit}`
    );
    res.json(result.data);
  } catch (err) {
    res.status(400).json({ message: "Error fetching forecast" });
  }
});

router.get("/:city", protect, async (req, res) => {
  const city = req.params.city;
  const unit = req.query.unit || 'metric';

  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=${unit}`
    );

    // Fetch Air Pollution data (Premium only)
    const { lat, lon } = result.data.coord;
    let pollutionResult = { data: null };
    if (req.user.role === 'premium') {
      pollutionResult = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`
      );
    }

    // Send search event to MQ
    await sendToQueue('weather_searches', { userId: req.user._id, city, temp: result.data.main.temp });

    res.json({ weather: result.data, pollution: pollutionResult.data });
  } catch (err) {
    console.error("Weather API Error:", err.message);
    if (err.response) console.error("API Response:", err.response.data);
    res.status(400).json({ message: "City not found" });
  }
});

module.exports = router;
