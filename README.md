# ZenAI Terminal Interface

An interactive web-based AI chatbot with a retro terminal interface.

## Features

- Retro terminal-style interface
- Command history navigation
- Basic terminal commands (help, clear, echo, date)
- AI-powered chat functionality
- Rate limiting for API endpoints
- Responsive design

## Available Commands

- `help`: Display available commands
- `clear`: Clear the terminal screen
- `echo [text]`: Display the provided text
- `date`: Show current date and time
- `ask [question]`: Ask ZenAI a question
- `history`: Show command history

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=3000
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Development

- Frontend code is in the `public` directory
- Backend server code is in `server.js`
- Styles are in `public/css/style.css`
- JavaScript is in `public/js/app.js`

## Technologies Used

- Node.js
- Express.js
- HTML5
- CSS3
- JavaScript (ES6+)
- CORS
- dotenv 