import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

console.log("API function started");

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
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [SYSTEM_MESSAGE, { role, content }],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0].message.content;

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

    return res.status(200).json({ content: aiResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
} 