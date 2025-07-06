const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets, getMyTickets, updateTicketStatus } = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a ticket (customer)
router.post('/', protect, createTicket);

// Get all tickets (admin)
router.get('/all', protect, admin, getAllTickets);

// Get my tickets (customer)
router.get('/my', protect, getMyTickets);

// Update ticket status (admin)
router.patch('/:id/status', protect, admin, updateTicketStatus);

module.exports = router;