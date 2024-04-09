let word;
const qwertz = ["QWERTZUIOP", "ASDFGHJKL", "YXCVBNM"];
const guesses = [""];
let guessCount = 0;
const absent = new Set();
const misplaced = new Set();
const exactMatch = new Set();
var cnv

// Preload Word List into variable
function preload() {
    wordList = loadStrings('./lib/words.txt');
}
// Centers Canvas when called
function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function setup() {
    // Creates and Centers Canvas
    cnv  = createCanvas(windowWidth * 0.5, windowHeight * 0.9);
    centerCanvas();

    word = random(wordList).toUpperCase();
    textAlign(CENTER);
    noLoop;
}
function draw() {
    background(200);
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 5; c++) {
            const charGuessed = guessCount >= r && guesses[r].length > c;
            const guessChar = charGuessed ? guesses[r][c] : null;

            if (guessCount > r) {
                if (word[c] === guessChar) {
                    fill("green");
                } else if (misplaced.has(guessChar)) {
                    fill("yellow");
                } else {
                    fill(60);
                }
            } else {
                fill(0);
            }
            stroke(80);
            rect(
                width * (0.1 + c * 0.16),
                height * (0.05 + 0.07 * r),
                width * 0.16,
                height * 0.07,
                width * 0.02
            );
            if (charGuessed) {
                fill(255);
                text(
                    guessChar,
                    width * (0.1 + c * 0.16),
                    height * (0.07 + 0.07 * r),
                    width * 0.16,
                    height * 0.1
                );
            }
        }
    }
}
for (let k = 0; k < 3; k++) {
    const rowLen = qwertz[k].length;
    for (let b = 0; b < rowLen; b++) {
        const keyChar = qwertz[k][b];
        if (exactMatch.has(keyChar)) {
            fill("green");
        } else if (misplaced.has(keyChar)) {
            fill("yellow");
        } else if (absent.has(keyChar)) {
            fill(60);
        } else {
            fill(120);
        }
        rect(
            b * (width / rowLen),
            height * 0.7 + k * height * 0.1,
            width / rowLen,
            height * 0.1
        );
        fill(255);
        text(
            keyChar,
            b * (width / rowLen),
            height * 0.7 + k * height * 0.1 + height * 0.05,
            width / rowLen,
            height * 0.1
        );
    }
}
function keyTyped() {
    if (key.length === 1) guesses[guessCount] += key.toUpperCase();
    redraw();
}

function keyPressed() {
    const charCount = guesses[guessCount].length;
    if (keyCode === BACKSPACE) {
        guesses[guessCount] = guesses[guessCount].slice(0, charCount - 1);
    } else if (keyCode === ENTER && charCount === 5) {
        //if(!wordList.includes(guesses[guessCount])) return alert("Guess is not in word list");
        for (let i = 0; i < guesses[guessCount].length; i++) {
            const guessChar = guesses[guessCount][i];
            if (word.includes(guessChar)) {
                if (word[i] === guessChar) {
                    exactMatch.add(guessChar);
                } else {
                    misplaced.add(guessChar);
                }
            } else {
                absent.add(guessChar);
            }
        }

        guessCount++;
        guesses.push("");
    }
    redraw();
}


function windowResized() {
    centerCanvas();
}