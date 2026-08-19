Weather Dashboard

A full-stack weather dashboard built using the MERN stack. Users can search for cities and view current weather information, save favorite cities, and manage their preferences.

The project also includes JWT authentication, premium features, and a basic subscription system using Stripe.

✨ Features
🔐 User registration and login using JWT
🌤️ Current weather information using the OpenWeatherMap API
📅 5-day weather forecast
⭐ Save and manage favorite cities
⚙️ User preferences such as temperature units
💎 Free and Premium user features
💳 Stripe subscription integration
📨 RabbitMQ for basic asynchronous messaging
📱 Responsive React-based interface
🛠️ Technologies Used

Frontend

React.js
Axios
React Router
Framer Motion

Backend

Node.js
Express.js
JWT
bcrypt.js

Database & Services

MongoDB & Mongoose
OpenWeatherMap API
Stripe
RabbitMQ
📂 Project Structure
weather-dashboard/
├── frontend/       # React frontend
├── backend/        # Node.js & Express backend
├── docs/            # Project documentation
├── .env.example
└── README.md
🚀 Running the Project
Backend
cd backend
npm install
npm start
Frontend
cd frontend
npm install
npm start

Create a .env file in the backend folder with your MongoDB, JWT, OpenWeatherMap, Stripe, and RabbitMQ configuration.

🎯 What I Learned

Through this project, I gained practical experience with:

Building a full-stack MERN application
Connecting a React frontend with an Express backend
Working with REST APIs
Implementing JWT authentication
Using MongoDB for storing user data
Integrating third-party APIs and Stripe
Understanding basic role-based access control and message queues
📌 Project Status

Completed as a student project and portfolio application.
