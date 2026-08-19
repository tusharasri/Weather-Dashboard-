// backend/routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require('../models/user');

const stripeService = require('../services/stripeService');
const { sendToQueue } = require('../services/mqService');

// Create a new subscription for the authenticated user
router.post('/create', protect, async (req, res) => {
    try {
        const { priceId } = req.body; // Stripe price ID for the plan
        const customer = await stripeService.createOrRetrieveCustomer(req.user.email, req.user.id);
        const subscription = await stripeService.createSubscription(customer.id, priceId);

        // Send welcome notification (non-blocking)
        try {
            await sendToQueue('notification_queue', {
                type: 'WELCOME_EMAIL',
                email: req.user.email,
                planId: priceId
            });
        } catch (mqError) {
            console.error("Failed to send notification:", mqError.message);
            // Continue execution, don't fail the request
        }

        // Update user role to premium
        req.user.role = 'premium';
        await User.findByIdAndUpdate(req.user.id, { role: 'premium' });

        const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret || null;
        res.json({ subscriptionId: subscription.id, clientSecret });
    } catch (err) {
        console.error("Subscription creation error:", err);
        res.status(500).json({ message: err.message || 'Subscription creation failed' });
    }
});

// Get subscription status for the authenticated user
router.get('/status', protect, async (req, res) => {
    try {
        const customer = await stripeService.createOrRetrieveCustomer(req.user.email, req.user.id);
        const subscriptions = await stripeService.listSubscriptions(customer.id);
        res.json({ subscriptions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch subscription status' });
    }
});

// Cancel a subscription
router.post('/cancel', protect, async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const canceled = await stripeService.cancelSubscription(subscriptionId);
        res.json({ canceled });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cancellation failed' });
    }
});

// Reactivate a subscription
router.post('/reactivate', protect, async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const reactivated = await stripeService.reactivateSubscription(subscriptionId);
        res.json({ reactivated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Reactivation failed' });
    }
});

module.exports = router;
