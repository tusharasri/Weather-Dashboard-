const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected");

        const users = await mongoose.connection.db.collection("users").find({
            email: { $regex: "yella", $options: "i" }
        }).toArray();

        console.log("Found users matching 'yella':", JSON.stringify(users, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

checkUser();
