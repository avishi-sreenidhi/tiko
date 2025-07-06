const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Middleware imports
const { protect, admin } = require('./middleware/authMiddleware');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/ai', aiRoutes);

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

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit if DB connection fails
  });