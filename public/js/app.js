class SmartStash {
  constructor() {
    this.initializeUI();
    this.initializeScroll();
  }

  initializeUI() {
    // Button handlers
    document.getElementById('get-started').addEventListener('click', () => {
      document.querySelector('.terminal-overlay').style.display = 'block';
      document.getElementById('terminal-input').focus();
    });

    document.querySelector('.close').addEventListener('click', () => {
      document.querySelector('.terminal-overlay').style.display = 'none';
    });

    document.getElementById('learn-more').addEventListener('click', () => {
      document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
    });

    // Initialize wallet buttons
    const walletButtons = document.querySelectorAll('.wallet-btn');
    walletButtons.forEach(button => {
      button.addEventListener('click', () => this.connectWallet(button.classList[1]));
    });

    // Close terminal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelector('.terminal-overlay').style.display = 'none';
      }
    });
  }

  initializeScroll() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        document.getElementById('how-it-works').scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      });

      // Hide scroll indicator when user scrolls down
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          scrollIndicator.style.opacity = '0';
          scrollIndicator.style.pointerEvents = 'none';
        } else {
          scrollIndicator.style.opacity = '0.8';
          scrollIndicator.style.pointerEvents = 'all';
        }
      });
    }
  }

  async connectWallet(type) {
    try {
      if (type === 'phantom') {
        if (!window.solana || !window.solana.isPhantom) {
          alert('Phantom wallet is not installed!');
          window.open('https://phantom.app/', '_blank');
          return;
        }
        await window.solana.connect();
      } else if (type === 'solflare') {
        if (!window.solflare) {
          alert('Solflare wallet is not installed!');
          window.open('https://solflare.com/', '_blank');
          return;
        }
        await window.solflare.connect();
      }
      this.updateWalletUI(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  }

  updateWalletUI(connected) {
    const walletSection = document.querySelector('.wallet-connect');
    if (connected) {
      walletSection.innerHTML = `
        <h2>Wallet Connected</h2>
        <div class="wallet-info">
          <i class="fas fa-check-circle"></i>
          <p>Your wallet is connected and ready to use SmartStash!</p>
        </div>
      `;
    }
  }
}

class Terminal {
  constructor() {
    this.inputField = document.getElementById('terminal-input');
    this.outputDiv = document.getElementById('output');
    this.asciiTitle = document.getElementById('ascii-title');
    this.welcomeMessage = document.getElementById('welcome-message');
    this.commandHistory = [];
    this.historyIndex = -1;
    this.initializeEventListeners();
    this.displayAsciiTitle();
    this.displayWelcomeMessage();
  }

  initializeEventListeners() {
    this.inputField.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const userMessage = this.inputField.value.trim();
        if (!userMessage) return;

        this.appendToTerminal(`> ${userMessage}`, 'user');
        this.inputField.value = '';
        this.commandHistory.push(userMessage);
        this.historyIndex = this.commandHistory.length;

        await this.processCommand(userMessage);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory('down');
      }
    });

    // Prevent terminal overlay from closing when clicking inside
    document.querySelector('.terminal-window').addEventListener('click', (e) => {
      e.stopPropagation();
      this.inputField.focus();
    });

    // Close terminal when clicking outside
    document.querySelector('.terminal-overlay').addEventListener('click', () => {
      document.querySelector('.terminal-overlay').style.display = 'none';
    });
  }

  navigateHistory(direction) {
    if (direction === 'up' && this.historyIndex > 0) {
      this.historyIndex--;
      this.inputField.value = this.commandHistory[this.historyIndex];
    } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      this.inputField.value = this.commandHistory[this.historyIndex];
    } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
      this.historyIndex = this.commandHistory.length;
      this.inputField.value = '';
    }
  }

  displayAsciiTitle() {
    const asciiArt = 
`
  ╔═══════════════════════════════════════════════════════════════╗
  ║    ____                       _   ____  _            _        ║
  ║   / ___| _ __ ___   __ _ _ __| |_/ ___|| |_ __ _ ___| |__     ║
  ║   \\___ \\|  _ \` _ \\ / _\` | '__| __\\___ \\| __/ _\` / __| '_ \\    ║
  ║    ___) | | | | | | (_| | |  | |_ ___) | || (_| \\__ \\ | | |   ║
  ║   |____/|_| |_| |_|\\__,_|_|   \\__|____/ \\__\\__,_|___/_| |_|   ║
  ║                                                               ║
  ║                 AI-Powered Savings Vault v1.0                 ║
  ╚═══════════════════════════════════════════════════════════════╝
  `;
    this.asciiTitle.textContent = asciiArt;
  }

  displayWelcomeMessage() {
    const welcomeText = 
`Welcome to SmartStash Terminal v1.0
Type 'help' to see available commands
`;
    this.welcomeMessage.textContent = welcomeText;
    this.appendToTerminal('Type a command to begin...', 'info');
  }

  async processCommand(command) {
    const cmd = command.toLowerCase().split(' ')[0];
    const args = command.split(' ').slice(1).join(' ');

    switch(cmd) {
      case 'help':
        this.displayHelp();
        break;
      case 'clear':
        this.clearTerminal();
        break;
      case 'balance':
        this.displayBalance();
        break;
      case 'stake':
        await this.handleStake(args);
        break;
      case 'rewards':
        this.displayRewards();
        break;
      case 'insights':
        this.displayInsights();
        break;
      default:
        this.appendToTerminal(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
    }
  }

  displayHelp() {
    const helpText = 
`Available Commands:
╭───────────────────────────────────────╮
│ balance  - Check your current balance │
│ stake    - Stake your tokens          │
│ rewards  - View earned rewards        │
│ insights - Get AI-powered insights    │
│ clear    - Clear the terminal         │
│ help     - Show this help message     │
╰───────────────────────────────────────╯`;
    this.appendToTerminal(helpText, 'success');
  }

  displayBalance() {
    // Mock balance data
    const balanceText = 
`Current Balance:
SOL: 10.5
Staked: 5.0
Rewards: 0.25`;
    this.appendToTerminal(balanceText, 'success');
  }

  async handleStake(amount) {
    if (!amount) {
      this.appendToTerminal('Please specify an amount to stake. Usage: stake <amount>', 'error');
      return;
    }
    // Mock staking process
    this.appendToTerminal('Processing stake...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.appendToTerminal(`Successfully staked ${amount} SOL!`, 'success');
  }

  displayRewards() {
    // Mock rewards data
    const rewardsText = 
`Rewards Summary:
Total Earned: 0.25 SOL
Current APY: 7.5%
Next Reward: 12 hours`;
    this.appendToTerminal(rewardsText, 'success');
  }

  displayInsights() {
    // Mock AI insights
    const insights = [
      "You're 2 weeks away from unlocking 10% bonus rewards!",
      "Increasing your stake by 2 SOL would optimize your returns.",
      "Market volatility is low - good time to increase stakes."
    ];
    this.appendToTerminal('AI Insights:\n' + insights.join('\n'), 'success');
  }

  clearTerminal() {
    this.outputDiv.innerHTML = '';
    this.displayWelcomeMessage();
  }

  appendToTerminal(message, type = 'default') {
    const messageElement = document.createElement('div');
    messageElement.className = `terminal-message ${type}`;
    messageElement.textContent = message;
    this.outputDiv.appendChild(messageElement);
    this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
  }
}

// Initialize both UI and Terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.smartStash = new SmartStash();
  window.terminal = new Terminal();
}); 