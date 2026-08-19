require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function listPrices() {
    try {
        console.log("Fetching prices...");
        const prices = await stripe.prices.list({
            limit: 10,
            active: true,
            expand: ['data.product']
        });

        if (prices.data.length === 0) {
            console.log("No active prices found.");
            return;
        }

        console.log("\nAvailable Prices:");
        prices.data.forEach(price => {
            const productName = price.product.name || "Unknown Product";
            const amount = (price.unit_amount / 100).toFixed(2);
            const currency = price.currency.toUpperCase();
            const interval = price.recurring ? `/${price.recurring.interval}` : " (One-time)";

            console.log(`--------------------------------------------------`);
            console.log(`Product: ${productName}`);
            console.log(`Price ID: ${price.id}`);
            console.log(`Amount: ${amount} ${currency}${interval}`);
        });
        console.log(`--------------------------------------------------\n`);

    } catch (error) {
        console.error("Error fetching prices:", error.message);
    }
}

listPrices();
