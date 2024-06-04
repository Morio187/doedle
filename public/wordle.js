const socket = io();

let wordLength = 5;
let currentGuess = '';
let currentRow = 0;
let playerColor = '';

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const playerList = document.getElementById('playerList');
const chatMessages = document.getElementById('chatMessages');

function setNickname() {
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        socket.emit('setNickname', nickname);
        document.getElementById('nicknameInput').style.display = 'none';
        document.getElementById('game').style.display = 'flex';
    }
}

socket.on('gameState', ({ player, wordLength }) => {
    playerColor = player.color;
    createBoard(wordLength);
    createKeyboard();
});

socket.on('guessResult', ({ guess, result }) => {
    revealGuess(guess, result);
    if (result.every(r => r === 'success')) {
        alert('Congratulations! You guessed the word!');
        socket.emit('newWord');
    }
});

socket.on('newWord', (newWordLength) => {
    wordLength = newWordLength;
    resetBoard();
});

socket.on('updatePlayers', (players) => {
    updatePlayerList(players);
});

socket.on('chatMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.nickname}: ${data.message}`;
    messageElement.style.color = data.color;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

function createBoard(length) {
    board.innerHTML = '';
    for (let i = 0; i < 10; i++) { // Ensure 10 rows for the board
        const row = document.createElement('tr');
        for (let j = 0; j < length; j++) {
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
        key.dataset.key = letter;
        key.onclick = () => handleKey(letter);
        keyboard.appendChild(key);
    });

    const enterKey = document.createElement('div');
    enterKey.className = 'key';
    enterKey.textContent = 'Enter';
    enterKey.dataset.key = 'Enter';
    enterKey.onclick = () => handleKey('Enter');
    keyboard.appendChild(enterKey);

    const backspaceKey = document.createElement('div');
    backspaceKey.className = 'key';
    backspaceKey.textContent = 'Backspace';
    backspaceKey.dataset.key = 'Backspace';
    backspaceKey.onclick = () => handleKey('Backspace');
    keyboard.appendChild(backspaceKey);
}

function handleKey(key) {
    if (document.activeElement.id === 'chatInput') {
        // Do nothing if the focus is on chat input
        return;
    }

    if (key === 'Enter') {
        if (currentGuess.length === wordLength) {
            socket.emit('guess', currentGuess);
            currentGuess = '';
        }
    } else if (key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1);
    } else if (currentGuess.length < wordLength && /^[a-zA-Z]$/.test(key)) {
        currentGuess += key;
    }
    updateBoard();
}

function updateBoard() {
    const row = board.rows[currentRow];
    for (let i = 0; i < wordLength; i++) {
        const cell = row.cells[i];
        cell.textContent = currentGuess[i] || '';
    }
}

function revealGuess(guess, result) {
    const row = board.rows[currentRow];
    for (let i = 0; i < wordLength; i++) {
        const cell = row.cells[i];
        cell.textContent = guess[i];
        cell.className = result[i];
    }
    currentRow++;
    currentGuess = '';
    updateKeyboard(guess, result);
}

function resetBoard() {
    currentRow = 0;
    currentGuess = '';
    createBoard(wordLength);
    createKeyboard(); // Ensure keyboard is reset when the board is reset
}

function updatePlayerList(players) {
    playerList.innerHTML = '';
    Object.values(players).forEach(player => {
        const playerElement = document.createElement('li');
        playerElement.textContent = `${player.nickname}: ${player.points} points`;
        playerElement.style.color = player.color; // Setzt die Farbe des Spielers
        playerList.appendChild(playerElement);
    });
}


function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value;
    if (message) {
        socket.emit('chatMessage', message);
        chatInput.value = '';
    }
}

function updateKeyboard(guess, result) {
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const key = document.querySelector(`.key[data-key="${letter}"]`);
        if (key) {
            if (result[i] === 'success') {
                key.classList.remove('partial', 'fail');
                key.classList.add('success');
            } else if (result[i] === 'partial') {
                key.classList.remove('success', 'fail');
                key.classList.add('partial');
            } else {
                key.classList.remove('success', 'partial');
                key.classList.add('fail');
            }
        }
    }
}

document.addEventListener('keydown', (event) => {
    handleKey(event.key);
});
