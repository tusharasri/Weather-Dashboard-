require("dotenv").config({ path: "../.env" });
const axios = require("axios");

const verifyWeather = async () => {
    const city = "London";
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    console.log(`Testing API Key: ${apiKey ? apiKey.substring(0, 5) + "..." : "MISSING"}`);
    console.log(`URL: ${url.replace(apiKey, "HIDDEN")}`);

    try {
        const res = await axios.get(url);
        console.log("Weather API Success:", res.status);
        console.log("Data:", res.data.weather[0].description);

        const { lat, lon } = res.data.coord;
        const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        console.log(`Testing Pollution URL: ${pollutionUrl.replace(apiKey, "HIDDEN")}`);

        const pollutionRes = await axios.get(pollutionUrl);
        console.log("Pollution API Success:", pollutionRes.status);
    } catch (err) {
        console.error("API Failed:", err.response ? err.response.data : err.message);
    }
};

verifyWeather();
