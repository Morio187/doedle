const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

var fs = require('fs');

app.use(express.static('public'));

var words = fs.readFileSync('words.txt').toString().split("\n");
let selectedWord = words[Math.floor(Math.random() * words.length)];

let players = {};


io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    players[socket.id] = {
        id: socket.id,
        points: 0
    };

    socket.emit('gameState', { players, wordLength: selectedWord.length });

    socket.on('guess', (guess) => {
        const result = checkGuess(guess);
        io.emit('guessResult', { playerId: socket.id, guess, result });

        if (guess === selectedWord) {
            players[socket.id].points++;
            selectedWord = words[Math.floor(Math.random() * words.length)];
            io.emit('newWord', selectedWord.length);
        }

        io.emit('updatePlayers', players);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

function checkGuess(guess) {
    const result = [];
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === selectedWord[i]) {
            result.push('success');
        } else if (selectedWord.includes(guess[i])) {
            result.push('partial');
        } else {
            result.push('fail');
        }
    }
    currentGuess += guess + ' ';
    if (currentGuess.length / wordLength > currentRow) {
        currentRow++;
        createRow(currentRow);
    }
    if (currentRow === maxRows) {
        io.emit('newWord', selectedWord.length);
        resetBoard();
    }
    return result;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
