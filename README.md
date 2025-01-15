# ZenAI Terminal Interface

An interactive web-based AI chatbot with a retro terminal interface.

## Features

- Retro terminal-style interface with customizable background
- Command history navigation
- Basic terminal commands (help, clear, echo, date)
- AI-powered chat functionality
- Rate limiting for API endpoints
- Responsive design
- Glassmorphic UI elements with backdrop blur effects

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
PORT=8080
NODE_ENV=development
```

3. Add background image:
   - Place your background image in `public/images/`
   - Name it `background.jpg`
   - Recommended: dark-themed image, 1920x1080px or larger

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

## Development

- Frontend code is in the `public` directory
- Backend server code is in `server.js`
- Styles are in `public/css/style.css`
- JavaScript is in `public/js/app.js`
- Background image goes in `public/images/background.jpg`

## Customization

### Background Image
The terminal interface supports custom background images:
1. Replace `public/images/background.jpg` with your own image
2. Image should be:
   - Dark or neutral-toned for readability
   - High resolution (1920x1080px minimum recommended)
   - Under 500KB for optimal loading
   - JPG/JPEG format

## Technologies Used

- Node.js
- Express.js
- HTML5
- CSS3 (with modern features like backdrop-filter)
- JavaScript (ES6+)
- CORS
- dotenv