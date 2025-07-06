const Ticket = require('../models/Ticket');

// Create a new ticket (customer)
exports.createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;
        const ticket = new Ticket({
            title,
            description,
            createdBy: req.user.userId // userId from JWT
        });
        await ticket.save();
        res.status(201).json({ message: 'Ticket created successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all tickets (admin)
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('createdBy', 'name email');
        res.json({ tickets });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get tickets for the logged-in customer
exports.getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ createdBy: req.user.userId });
        res.json({ tickets });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin: Update ticket status
exports.updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params; // Fixed: use 'id' instead of 'ticketId'
        const { status } = req.body;

        // Only allow valid statuses
        const validStatuses = ['open', 'in progress', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            id, // Fixed: use 'id' instead of 'ticketId'
            { status },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ message: 'Ticket status updated', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};