const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('../models/user');

const checkUserRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'debug_sub@test.com' });
        console.log(`User: ${user.email}, Role: ${user.role}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUserRole();
