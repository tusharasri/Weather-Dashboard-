require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' });

const TEST_EMAIL = "test_user_debug@example.com";
const PRICE_ID = "price_1SY24WLGPXFIrSr9HLe1cah5"; // The one provided to the user

async function testFlow() {
    console.log("Starting Subscription Flow Test...");
    console.log(`Price ID: ${PRICE_ID}`);

    try {
        // 1. Create Customer
        console.log("\n1. Creating/Retrieving Customer...");
        const customers = await stripe.customers.list({ email: TEST_EMAIL, limit: 1 });
        let customer;
        if (customers.data.length > 0) {
            customer = customers.data[0];
            console.log("Found existing customer:", customer.id);
        } else {
            customer = await stripe.customers.create({ email: TEST_EMAIL });
            console.log("Created new customer:", customer.id);
        }

        // 2. Create Subscription
        console.log("\n2. Creating Subscription...");
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: PRICE_ID }],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription'
            },
            expand: ['latest_invoice.payment_intent']
        });

        console.log("Subscription created successfully!");
        console.log("Subscription ID:", subscription.id);
        console.log("Subscription Payment Settings:", JSON.stringify(subscription.payment_settings, null, 2));

        const invoiceId = subscription.latest_invoice.id;
        console.log("Retrieving invoice:", invoiceId);
        const invoice = await stripe.invoices.retrieve(invoiceId, {
            expand: ['payment_intent']
        });

        console.log("Invoice Payment Intent:", invoice.payment_intent);
        if (invoice.payment_intent) {
            console.log("Client Secret:", invoice.payment_intent.client_secret);
        } else {
            console.log("Client Secret: undefined (Payment Intent is null)");
        }

    } catch (error) {
        console.error("\n❌ Error occurred:");
        console.error("Type:", error.type);
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        if (error.param) console.error("Param:", error.param);
    }
}

testFlow();
