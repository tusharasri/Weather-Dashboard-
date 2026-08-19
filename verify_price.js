require("dotenv").config({ path: "../.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const priceId = "price_1SY24WLGPXFIrSr9HLe1cah5";

const verifyPrice = async () => {
    try {
        const price = await stripe.prices.retrieve(priceId);
        console.log("Price Found:", price.id, price.unit_amount, price.currency);
    } catch (err) {
        console.error("Price Verification Failed:", err.message);
    }
};

verifyPrice();
