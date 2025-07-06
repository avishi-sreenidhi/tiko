const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Middleware imports (fixed to use the correct exports)
const { protect, admin } = require('./middleware/authMiddleware');

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Tiko Support Ticket API!' });
});

// Protected route example
app.get('/api/protected', protect, (req, res) => {
    res.json({ message: `Hello, ${req.user.role} user! You have accessed a protected route.` });
});

// Admin-only route example
app.get('/api/admin-only', protect, admin, (req, res) => {
    res.json({ message: 'Welcome, admin! This is a protected admin route.' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});