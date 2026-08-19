require("dotenv").config({ path: "../.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const verify = async () => {
    console.log("Using Secret Key:", process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 10) + "..." : "MISSING");
    try {
        const balance = await stripe.balance.retrieve();
        console.log("Stripe Connection Successful!");
        console.log("Balance:", balance);
    } catch (err) {
        console.error("Stripe Connection Failed:", err.message);
    }
};

verify();
