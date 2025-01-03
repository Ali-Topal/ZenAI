require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// Command handling endpoint
app.post('/api/command', async (req, res) => {
    try {
        const { command, question } = req.body;

        if (command === 'ask') {
            if (!question) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No question provided'
                });
            }

            // TODO: Implement AI response logic here
            // For now, return a mock response
            const response = `This is a mock response to your question: "${question}". AI integration coming soon!`;
            
            return res.json({
                status: 'success',
                output: response
            });
        }

        res.status(400).json({
            status: 'error',
            message: 'Invalid command'
        });
    } catch (error) {
        console.error('Error processing command:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something broke!'
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Not found'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 