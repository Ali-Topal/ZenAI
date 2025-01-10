class Terminal {
  constructor() {
    this.inputField = document.getElementById('terminal-input');
    this.outputDiv = document.getElementById('output');
    this.asciiTitle = document.getElementById('ascii-title');
    this.welcomeMessage = document.getElementById('welcome-message');
    this.commandHistory = [];
    this.preloadBackground();
    this.initializeEventListeners();
  }

  preloadBackground() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Create image object to preload
    const img = new Image();
    img.src = '/images/background.jpg';
    
    img.onload = () => {
      // Remove loading class and show content
      document.body.classList.remove('loading');
      document.querySelector('.terminal-window').classList.add('loaded');
      
      // Initialize terminal after background loads
      this.displayAsciiTitle();
      this.displayWelcomeMessage();
      this.displayInitialLogo();
    };
    
    // Fallback if image fails to load
    img.onerror = () => {
      document.body.classList.remove('loading');
      document.querySelector('.terminal-window').classList.add('loaded');
      this.displayAsciiTitle();
      this.displayWelcomeMessage();
      this.displayInitialLogo();
    };
  }

  initializeEventListeners() {
    this.inputField.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const userMessage = this.inputField.value.trim();
        if (!userMessage) return;

        this.appendToTerminal(`> ${userMessage}`, 'user');
        this.inputField.value = '';

        await this.processUserInput(userMessage);
      }
    });
  }

  displayAsciiTitle() {
    const asciiArt = 
`╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           ███████╗███████╗███╗   ██╗ █████╗ ██╗          ║
║           ╚══███╔╝██╔════╝████╗  ██║██╔══██╗██║          ║
║             ███╔╝ █████╗  ██╔██╗ ██║███████║██║          ║
║            ███╔╝  ██╔══╝  ██║╚██╗██║██╔══██║██║          ║
║           ███████╗███████╗██║ ╚████║██║  ██║██║          ║
║           ╚══════╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝`;
    this.asciiTitle.textContent = asciiArt;
  }

  displayWelcomeMessage() {
    const welcomeArt = 
`╔══════════════════════════════════════════╗
║                                          ║
║      Welcome to ZenAI Terminal v1.0      ║
║       The Future of Crypto is Here       ║
║                                          ║
╚══════════════════════════════════════════╝

Type "help" for available commands`;
    this.welcomeMessage.textContent = welcomeArt;
  }

  displayInitialLogo() {
    const logo = 
`                    ++++                    
             ++-:...   .:=#%#+*             
          +=..             .=@@@*+          
        +:.                  .%@@@%+        
      +:.                      %@@@@%+      
    +=.            =@@@@=      :@@@@@@**    
   +-             .@@@@@@:      @@@@@@@#*   
  *=.             .*@@@@*.     :@@@@@@@@**  
  +.                ....       #@@@@@@@@@+  
 +-                          .*@@@@@@@@@@#+ 
 +.                         -@@@@@@@@@@@@@+ 
 +                       :#@@@@@@@@@@@@@@@* 
 +              .-%@@@@@@@@@@@@@@@@@@@@@@@* 
 +.           .#@@@@@@@@@@@@@@@@@@@@@@@@@@+ 
 +-          -@@@@@@@@@@@@@@@@@@@@@@@@@@@#+ 
  +.        :@@@@@@@@@@@@@@@@@@@@@@@@@@@@+  
  *=.       %@@@@@@=.  .=@@@@@@@@@@@@@@@**  
   *-      .@@@@@@@.     @@@@@@@@@@@@@@#+   
    *=.     %@@@@@@*.  .*@@@@@@@@@@@@@*+    
      +:    :@@@@@@@@@@@@@@@@@@@@@@@%+      
        +:.  :@@@@@@@@@@@@@@@@@@@@%+        
          +=.. *@@@@@@@@@@@@@@@@*+          
             *+=:-#%@@@@@@@%#++             
                   *+++++                   `;
    this.appendToTerminal(logo, 'bot');
    this.appendToTerminal('Welcome to ZenAI - The Future of Crypto', 'bot');
  }

  async processUserInput(message) {
    this.commandHistory.push(message);
    
    switch(message.toLowerCase()) {
      case 'help':
        this.displayHelp();
        return;
      case 'clear':
        this.clearTerminal();
        return;
      case 'date':
        this.displayDateTime();
        return;
      case 'history':
        this.displayHistory();
        return;
      case 'echo':
        this.appendToTerminal('Please provide text to echo. Usage: echo <text>', 'bot');
        return;
    }

    if (message.toLowerCase().startsWith('echo ')) {
      const text = message.slice(5);
      const emojis = ['✨', '🚀', '💫', '⭐', '🌟'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      this.appendToTerminal(`${randomEmoji} ${text} ${randomEmoji}`, 'bot');
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: message })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      const data = await response.json();
      this.appendToTerminal(data.content, 'bot');
    } catch (error) {
      console.error('Error:', error);
      this.appendToTerminal(`Error: ${error.message || 'Unable to process your request.'}`, 'error');
    }
  }

  displayDateTime() {
    const quotes = [
      "Time to make crypto history! 🚀",
      "Another day, another opportunity in crypto! ✨",
      "The future of finance is being written right now! 💫",
      "Innovation never sleeps in crypto! ⭐",
      "Building the future, one block at a time! 🌟"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    this.appendToTerminal(`📅 ${dateStr}\n${randomQuote}`, 'bot');
  }

  displayHistory() {
    if (this.commandHistory.length === 0) {
      this.appendToTerminal('No commands in history yet!', 'bot');
      return;
    }
    const history = this.commandHistory.map((cmd, i) => 
      `${(i + 1).toString().padStart(2, ' ')}  ${cmd}`
    ).join('\n');
    this.appendToTerminal(`Last ${this.commandHistory.length} commands:\n${history}`, 'bot');
  }

  displayHelp() {
    const helpText = 
`╔══════════════════════════════════════════════════╗
║                                                  ║
║              Available Commands                  ║
╠══════════════════════════════════════════════════╣
║  Core Commands:                                  ║
║  clear   - Clear chat for a fresh start          ║
║  date    - Show time with inspirational quote    ║
║  echo    - Repeat text you entered               ║
║  help    - Show this fancy command list          ║
║  history - View your command history             ║
║                                                  ║
║  Chat Commands:                                  ║
║  Just type any message to chat with ZenAI!       ║
║                                                  ║
╚══════════════════════════════════════════════════╝`;
    const messageElement = document.createElement('pre');
    messageElement.textContent = helpText;
    messageElement.className = 'terminal-message help-text';
    this.outputDiv.appendChild(messageElement);
    this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
  }

  clearTerminal() {
    this.outputDiv.innerHTML = '';
  }

  appendToTerminal(message, type = 'bot') {
    const messageElement = document.createElement('pre');
    messageElement.textContent = message;
    messageElement.className = `terminal-message ${type}`;
    this.outputDiv.appendChild(messageElement);
    this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.terminal = new Terminal();
}); 