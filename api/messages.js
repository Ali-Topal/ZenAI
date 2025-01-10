import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// System message for ZenAI
const SYSTEM_MESSAGE = {
  role: "system",
  content: "You are ZenAI, a confident and enthusiastic AI assistant. You provide concise, helpful responses with a touch of personality."
};

export default async function handler(req, res) {
  console.log("Request received:", req.body);

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, content } = req.body;

  if (!role || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // OpenAI API request
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [SYSTEM_MESSAGE, { role, content }],
      max_tokens: 200,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Database operations in separate try-catch
    try {
      // Store the conversation in the database
      await pool.query(
        'INSERT INTO messages (role, content) VALUES ($1, $2)',
        [role, content]
      );

      // Store AI's response
      await pool.query(
        'INSERT INTO messages (role, content) VALUES ($1, $2)',
        ['assistant', aiResponse]
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with the response even if database operations fail
    }

    return res.status(200).json({ content: aiResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error.response?.data?.error?.message || error.message;
    return res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
    });
  }
} 