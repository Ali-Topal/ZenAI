class Terminal {
  constructor() {
    this.inputField = document.getElementById('terminal-input');
    this.outputDiv = document.getElementById('output');
    this.initializeEventListeners();
    this.displayWelcomeMessage();
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

  displayWelcomeMessage() {
    const welcomeMessage = `
Welcome to ZenAI Terminal
=========================
Type 'help' for available commands
`;
    this.appendToTerminal(welcomeMessage, 'bot');
  }

  async processUserInput(message) {
    if (message.toLowerCase() === 'help') {
      this.displayHelp();
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: message })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      this.appendToTerminal(data.content, 'bot');
    } catch (error) {
      console.error('Error:', error);
      this.appendToTerminal('Error: Unable to process your request.', 'error');
    }
  }

  displayHelp() {
    const helpText = `
Available Commands:
------------------
help     - Display this help message
clear    - Clear the terminal screen
Type any message to chat with ZenAI
`;
    this.appendToTerminal(helpText, 'bot');
  }

  appendToTerminal(message, type = 'bot') {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.className = `terminal-message ${type}`;
    this.outputDiv.appendChild(messageElement);
    this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.terminal = new Terminal();
}); 