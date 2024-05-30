const socket = io();

let wordLength = 5; // Set a default value; this will be updated by the server
let currentGuess = '';
let currentRow = 0;

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const playerList = document.getElementById('players');

socket.on('gameState', (state) => {
    updatePlayerList(state.players);
    resetBoard(state.wordLength);
});

socket.on('guessResult', ({ playerId, guess, result }) => {
    if (playerId === socket.id) {
        revealGuess(guess, result);
        if (result.every(r => r === 'success')) {
            message.textContent = 'Congratulations! You guessed the word!';
        } else if (currentRow === 10) {
            message.textContent = `Sorry, you're out of attempts! The word was "${selectedWord}".`;
        }
    }
});

socket.on('newWord', (newWordLength) => {
    wordLength = newWordLength;
    resetBoard();
});

socket.on('updatePlayers', (players) => {
    updatePlayerList(players);
});

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < wordLength; j++) {
            const cell = document.createElement('td');
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function createKeyboard() {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    keyboard.innerHTML = '';
    letters.forEach(letter => {
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = letter;
        key.addEventListener('click', () => handleKeyPress(letter));
        keyboard.appendChild(key);
    });
}

function handleKeyPress(letter) {
    if (currentGuess.length < wordLength) {
        currentGuess += letter;
        updateCurrentRow();
    }
}

function updateCurrentRow() {
    const row = board.rows[currentRow];
    for (let i = 0; i < wordLength; i++) {
        row.cells[i].textContent = currentGuess[i] || '';
    }
}

function revealGuess(guess, result) {
    const row = board.rows[currentRow];
    for (let i = 0; i < wordLength; i++) {
        const cell = row.cells[i];
        cell.textContent = guess[i];
        cell.className = result[i];
        updateKeyboard(guess[i], result[i]);
    }
    currentRow++;
    currentGuess = '';
}

function updateKeyboard(letter, result) {
    const keys = Array.from(keyboard.children);
    const key = keys.find(k => k.textContent === letter);
    key.className = `key ${result}`;
}

function updatePlayerList(players) {
    playerList.innerHTML = '';
    Object.values(players).forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `Player ${player.id}: ${player.points} points`;
        playerList.appendChild(listItem);
    });
}

function resetBoard() {
    currentGuess = '';
    currentRow = 0;
    createBoard();
    createKeyboard();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (currentGuess.length === wordLength) {
            socket.emit('guess', currentGuess);
            currentGuess = '';
            currentRow++;
        }
    } else if (e.key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1);
        updateCurrentRow();
    } else if (/^[a-z]$/.test(e.key)) {
        if (currentGuess.length < wordLength) {
            currentGuess += e.key;
            updateCurrentRow();
        }
    }
});
