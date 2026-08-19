require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/user");

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        const email = "debug@test.com";
        await User.deleteOne({ email }); // Clean up if exists

        const user = await User.create({
            name: "Debug User",
            email,
            password: "password123",
            role: "free"
        });

        console.log("User created:", user.email);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

createTestUser();
