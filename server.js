const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const words = fs.readFileSync('words.txt').toString().split("\n");

const players = {};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    socket.on('setNickname', (nickname) => {
        const playerWord = words[Math.floor(Math.random() * words.length)].trim();
        const color = getRandomColor();
        players[socket.id] = {
            id: socket.id,
            nickname,
            points: 0,
            selectedWord: playerWord,
            attempts: 0,
            color
        };

        socket.emit('gameState', { player: players[socket.id], wordLength: playerWord.length });
        io.emit('updatePlayers', Object.values(players));
    });

    socket.on('guess', (guess) => {
        const player = players[socket.id];
        if (!player) return;

        if (guess === player.selectedWord) {
            player.points++;
            player.selectedWord = words[Math.floor(Math.random() * words.length)].trim();
            player.attempts = 0;
            socket.emit('newWord', player.selectedWord.length);
        }
        else if (words.includes(guess)){
            const result = checkGuess(guess, player.selectedWord);
            socket.emit('guessResult', {guess, result});
            player.attempts++;
            if (player.attempts >= 10) {
                player.selectedWord = words[Math.floor(Math.random() * words.length)].trim();
                player.attempts = 0;
                socket.emit('newWord', player.selectedWord.length);
            }
        }
        io.emit('updatePlayers', Object.values(players));
    });

    socket.on('chatMessage', (message) => {
        const player = players[socket.id];
        if (!player) return;
        io.emit('chatMessage', { nickname: player.nickname, message, color: player.color });
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', Object.values(players));
    });
});

function checkGuess(guess, selectedWord) {
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
    return result;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
