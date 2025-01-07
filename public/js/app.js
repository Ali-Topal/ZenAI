class Terminal {
    constructor() {
        this.commandInput = document.getElementById('command-input');
        this.terminalOutput = document.getElementById('terminal-output');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.initializeEventListeners();
        this.displayWelcomeArt();
    }

    displayWelcomeArt() {
        const welcomeArt = `<pre>      

                                                            ..........                                        
                                                    ......           ..:-=+=:...                               
                                            ...                        -*@%#*=:.                           
                                        ...                               :*@@@@#=:.                       
                                        ..                                     .*@@@@@%+:.                    
                                    ...                                         -@@@@@@@%+..                 
                                ..                                             .@@@@@@@@@+:.               
                                ..                                                .@@@@@@@@@@*:.             
                                ..                           :+#%%#+-               =@@@@@@@@@@@+.            
                            ..                           :%@@@@@@@@%:              @@@@@@@@@@@@%-.          
                            ..                           .@@@@@@@@@@@@.             *@@@@@@@@@@@@@=.         
                            ..                            :@@@@@@@@@@@@-             *@@@@@@@@@@@@@@+.        
                        .                               #@@@@@@@@@@%              #@@@@@@@@@@@@@@@*.       
                        ..                                +@@@@@@@@+              .@@@@@@@@@@@@@@@@@+.      
                        ..                                   :-===:                *@@@@@@@@@@@@@@@@@@=.     
                        .                                                         =@@@@@@@@@@@@@@@@@@@@:.    
                        ..                                                        =@@@@@@@@@@@@@@@@@@@@@*.    
                        .                                                        *@@@@@@@@@@@@@@@@@@@@@@@:.   
                    ..                                                      =@@@@@@@@@@@@@@@@@@@@@@@@@=.   
                    .                                                    :*@@@@@@@@@@@@@@@@@@@@@@@@@@@*.   
                    .                                                .-*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#.   
                    .                                   .:--===++*#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%.   
                    .                               -+#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#.   
                    .                            -*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*.   
                    ..                         =%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=.   
                    ..                       :%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:.   
                        ..                     +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*.    
                        ..                    +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:.    
                        ..                  :@@@@@@@@@@@@@@@@%*++*%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=.     
                        ..                 %@@@@@@@@@@@@@@+.       =@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*.      
                        .                .@@@@@@@@@@@@@@:          .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*.       
                            .               :@@@@@@@@@@@@@#            *@@@@@@@@@@@@@@@@@@@@@@@@@@@@*.        
                            ..             :@@@@@@@@@@@@@%            %@@@@@@@@@@@@@@@@@@@@@@@@@@@+.         
                            ..             @@@@@@@@@@@@@@#.         *@@@@@@@@@@@@@@@@@@@@@@@@@@%-.          
                                ..           +@@@@@@@@@@@@@@@*=:..:-*@@@@@@@@@@@@@@@@@@@@@@@@@@@+.            
                                ..           %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*:.             
                                ..         .%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*:.               
                                    ...        *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+:.                 
                                        ..       -%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%*-.                    
                                        ...     -#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#+:.                       
                                            ....    =#@@@@@@@@@@@@@@@@@@@@@@#*=:..                          
                                                ......:=+*#%%@@@%%%##*+=-:..                               
                                                        ............                                      
</pre>
<span class="welcome-message">
    Welcome to the ZenAI Universe 
    Type 'help' to begin your journey...</span>`;
        
        const outputDiv = document.createElement('div');
        outputDiv.className = 'terminal-line success-message';
        outputDiv.innerHTML = welcomeArt;
        this.terminalOutput.appendChild(outputDiv);
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }

    initializeEventListeners() {
        this.commandInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            const command = this.commandInput.value.trim();
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command);
                this.commandInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory('down');
        }
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.commandInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.commandInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            this.commandInput.value = '';
        }
    }

    async executeCommand(command) {
        this.displayOutput(`$ ${command}`, 'command');
        
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        try {
            switch (cmd) {
                case 'help':
                    this.displayHelp();
                    break;
                case 'clear':
                    this.clearTerminal();
                    break;
                case 'echo':
                    this.displayOutput(args.join(' '), 'success');
                    break;
                case 'date':
                    this.displayOutput(new Date().toLocaleString(), 'success');
                    break;
                case 'ask':
                    await this.handleAskCommand(args.join(' '));
                    break;
                case 'history':
                    this.displayCommandHistory();
                    break;
                default:
                    this.displayOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
            }
        } catch (error) {
            this.displayOutput(`Error executing command: ${error.message}`, 'error');
        }
    }

    displayHelp() {
        const helpText = `Available Commands:\n
help     - Display this help message
clear    - Clear the terminal screen
echo     - Display the provided text
date     - Display current date and time
ask      - Ask ZenAI a question
history  - Show command history`;
        this.displayOutput(helpText, 'success');
    }

    async handleAskCommand(question) {
        if (!question) {
            this.displayOutput('Please provide a question after the ask command.', 'error');
            return;
        }

        this.displayOutput('Thinking...', 'info');
        
        try {
            const response = await fetch('/api/command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: 'ask', question }),
            });

            const data = await response.json();
            
            if (data.status === 'error') {
                this.displayOutput(data.message, 'error');
            } else {
                this.displayOutput(data.output, 'success');
            }
        } catch (error) {
            this.displayOutput('Failed to get a response. Please try again.', 'error');
        }
    }

    displayCommandHistory() {
        if (this.commandHistory.length === 0) {
            this.displayOutput('No commands in history.', 'info');
            return;
        }

        const historyText = this.commandHistory
            .map((cmd, index) => `${index + 1}. ${cmd}`)
            .join('\n');
        this.displayOutput(historyText, 'success');
    }

    displayOutput(text, type = 'default') {
        const output = document.createElement('div');
        output.textContent = text;
        output.className = `terminal-line ${type}-message`;
        this.terminalOutput.appendChild(output);
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }

    clearTerminal() {
        this.terminalOutput.innerHTML = '';
    }
}

// Initialize the terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
}); 