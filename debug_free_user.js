const axios = require('axios');

const debugFreeUser = async () => {
    try {
        // 1. Register a new user
        const email = `free_user_${Date.now()}@test.com`;
        console.log(`Registering user: ${email}`);
        const registerRes = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Free User',
            email: email,
            password: 'password123'
        });
        const token = registerRes.data.token;
        console.log('Registration successful. Token obtained.');

        // 2. Fetch Weather for London
        console.log('Fetching weather for London...');
        const weatherRes = await axios.get('http://localhost:5001/api/weather/London', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Weather fetch successful:', weatherRes.status);
        console.log('Data:', weatherRes.data);

    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
};

debugFreeUser();
