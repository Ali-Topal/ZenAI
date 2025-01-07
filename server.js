require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// AI Response Logic
app.post('/api/command', async (req, res) => {
    const { command, question } = req.body;

    if (command === 'ask') {
        if (!question) {
            return res.status(400).json({ status: 'error', message: 'No question provided' });
        }

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo", // or "gpt-4"
                messages: [{ role: "user", content: question }],
                max_tokens: 1000,
                temperature: 0.7,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const aiResponse = response.data.choices[0].message.content;
            return res.json({ status: 'success', output: aiResponse });
        } catch (error) {
            console.error('Error communicating with AI API:', error.message);
            return res.status(500).json({ status: 'error', message: 'Failed to get response from AI' });
        }
    }

    res.status(400).json({ status: 'error', message: 'Invalid command' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});