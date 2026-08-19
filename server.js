require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/config/db");

const authRoutes = require("./routes/authRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const userRoutes = require("./routes/userRoutes");

const { connectMQ } = require("./services/mqService");
const { startNotificationWorker } = require("./services/notificationService");

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

connectDB();
connectMQ();
startNotificationWorker();

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subscription", subscriptionRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on PORT ${PORT}`));
