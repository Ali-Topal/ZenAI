const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Routes
app.get('/.netlify/functions/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/.netlify/functions/api/messages', async (req, res) => {
  const { role, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (role, content) VALUES ($1, $2) RETURNING *',
      [role, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the serverless function handler
module.exports.handler = serverless(app); 