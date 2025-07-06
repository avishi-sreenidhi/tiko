const OpenAI = require('openai');
const Ticket = require('../models/Ticket'); // Import your Ticket model

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI reply for a ticket
const generateReply = async (req, res) => {
  try {
    const { ticketId, ticketTitle, ticketDescription } = req.body;

    const prompt = `You are a helpful customer support agent. A customer has submitted this support ticket:

Title: ${ticketTitle}
Description: ${ticketDescription}

Please provide a professional, helpful response to address their concern. Keep it concise and friendly. It has to be a short, one sentence reply.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.5,
    });

    const aiReply = completion.choices[0].message.content.trim();

    // Save the reply to the ticket
    await Ticket.findByIdAndUpdate(ticketId, { aiReply });

    res.json({ 
      success: true, 
      reply: aiReply 
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI reply' 
    });
  }
};

module.exports = { generateReply };