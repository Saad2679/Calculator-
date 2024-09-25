document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const history = document.getElementById('history');
    const toggleTheme = document.getElementById('toggleTheme');
    const toggleHistory = document.getElementById('toggleHistory');
    const deleteHistoryButton = document.getElementById('deleteHistory');

    let currentInput = '';
    let memoryValue = 0;
    let darkMode = true;
    let historyVisible = false;

    // Load history from local storage
    loadHistory();

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            const action = button.getAttribute('data-action');
            handleInput(value, action);
        });
    });

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (!isNaN(key) || key === '.') {
            handleInput(key);
        } else if (['+', '-', '*', '/'].includes(key)) {
            handleInput(key, 'operator');
        } else if (key === 'Enter' || key === '=') {
            handleInput(null, 'calculate');
        } else if (key === 'Backspace' || key === 'C' || key === 'c') {
            handleInput(null, 'clear');
        } else if (key === 's' || key === 'S') {
            handleInput(null, 'sqrt');
        } else if (key === 'p' || key === 'P') {
            handleInput(null, 'percent');
        } else if (key === 'm' || key === 'M') {
            handleInput(null, 'MR'); // Example: Toggle to memory recall
        }
    });

    // Function to handle input from both button clicks and keyboard
    function handleInput(value, action = null) {
        if (action === 'calculate') {
            try {
                const result = eval(currentInput);
                addToHistory(`${currentInput} = ${result}`);
                currentInput = result.toString();
            } catch {
                currentInput = 'Error';
                addToHistory(`${currentInput}`);
            }
        } else if (action === 'clear') {
            currentInput = '';
            display.textContent = '0';
        } else if (action === 'sqrt') {
            try {
                const result = Math.sqrt(eval(currentInput));
                addToHistory(`√(${currentInput}) = ${result}`);
                currentInput = result.toString();
            } catch {
                currentInput = 'Error';
                addToHistory(`${currentInput}`);
            }
        } else if (action === 'square') {
            try {
                const result = Math.pow(eval(currentInput), 2);
                addToHistory(`${currentInput}² = ${result}`);
                currentInput = result.toString();
            } catch {
                currentInput = 'Error';
                addToHistory(`${currentInput}`);
            }
        } else if (action === 'percent') {
            try {
                const result = eval(currentInput) / 100;
                addToHistory(`${currentInput}% = ${result}`);
                currentInput = result.toString();
            } catch {
                currentInput = 'Error';
                addToHistory(`${currentInput}`);
            }
        } else if (action === 'MC') {
            memoryValue = 0;
        } else if (action === 'MR') {
            currentInput = memoryValue.toString();
        } else if (action === 'M+') {
            memoryValue += eval(currentInput);
        } else if (action === 'M-') {
            memoryValue -= eval(currentInput);
        } else if (action === 'operator') {
            currentInput += value;
        } else {
            currentInput += value;
        }

        display.textContent = currentInput || '0';
    }

    // Toggle theme between dark and light mode
    toggleTheme.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.style.backgroundColor = darkMode ? '#1e1e1e' : '#f0f0f0';
        document.querySelector('.calculator').style.backgroundColor = darkMode ? '#2e2e2e' : '#ffffff';
    });

    // Toggle history visibility
    toggleHistory.addEventListener('click', () => {
        historyVisible = !historyVisible;
        history.style.display = historyVisible ? 'block' : 'none';
        deleteHistoryButton.style.display = historyVisible ? 'block' : 'none'; // Toggle delete button visibility
        toggleHistory.textContent = historyVisible ? 'Hide History' : 'Show History';
    });

    // Delete history from local storage and clear UI
    deleteHistoryButton.addEventListener('click', () => {
        localStorage.removeItem('calculatorHistory');
        history.innerHTML = ''; // Clear history display
        deleteHistoryButton.style.display = 'none'; // Hide delete button
    });

    function addToHistory(calculation) {
        const entry = document.createElement('div');
        entry.textContent = calculation;
        history.appendChild(entry);
        history.scrollTop = history.scrollHeight; // Auto-scroll to the latest entry

        // Save history to local storage
        saveHistory();
    }

    function saveHistory() {
        const historyEntries = Array.from(history.children).map(entry => entry.textContent);
        localStorage.setItem('calculatorHistory', JSON.stringify(historyEntries));
    }

    function loadHistory() {
        const savedHistory = localStorage.getItem('calculatorHistory');
        if (savedHistory) {
            const historyEntries = JSON.parse(savedHistory);
            historyEntries.forEach(entry => {
                const div = document.createElement('div');
                div.textContent = entry;
                history.appendChild(div);
            });
        }
    }
});
    