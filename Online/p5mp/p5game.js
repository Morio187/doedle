function preloadGame() {
    preloadLander();

}


function setupGame() {
    debug.log(DP5,'setupGame()');
    debug.indent(DP5);

    setupLander();

    debug.unindent(DP5);

}


function drawGame() {
    debug.log(DP5,'drawGame()');
    debug.indent(DP5);

    drawLander();

    debug.unindent(DP5);
}

function mousePressedGame(){
    debug.log(DP5,'mousePressedGame()');
    debug.indent(DP5);

    mousePressedLander();

    debug.unindent(DP5);

}

function keyPressedGame(){
    debug.log(DP5,'keyPressedGame()');
    debug.indent(DP5);

    keyPressedLander();

    debug.unindent(DP5);
}

function closingGame(){

}

