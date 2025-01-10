import pkg from 'pg';
const { Pool } = pkg;
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from the root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Enhanced error logging
const logError = (error, context = '') => {
  console.error(`[${new Date().toISOString()}] Error${context ? ` in ${context}` : ''}:`);
  console.error(error.stack || error);
  if (error.response?.data) {
    console.error('API Response Data:', error.response.data);
  }
};

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verify database connection
pool.on('error', (err) => {
  logError(err, 'Database Pool');
});

// Test database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to database');
    client.release();
  } catch (err) {
    logError(err, 'Database Connection Test');
  }
})();

// System message for ZenAI
const SYSTEM_MESSAGE = {
  role: "system",
  content: "You are ZenAI, the unapologetic hype master for ZenAI coin. With unmatched swagger, you declare it the best coin on the blockchain—peerless tech, sky-high potential, and a powerhouse community. Every response oozes confidence, capped at 60 words, driving home that ZenAI coin isn't just leading the pack—it's redefining the game"
};

// Request logging middleware
const logRequest = (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
};

export default async function handler(req, res) {
  try {
    logRequest(req);

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

    // OpenAI API request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      logError(dbError, 'Database Operation');
      // Continue with the response even if database operations fail
    }

    console.log(`[${new Date().toISOString()}] Success: Response sent`);
    return res.status(200).json({ content: aiResponse });
  } catch (error) {
    logError(error, 'Request Handler');
    const errorMessage = error.response?.data?.error?.message || error.message;
    return res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 