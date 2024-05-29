// p5 configuration
let fps = 60;

// client/server configuration
let ipServer = '127.0.0.1';


const CANVASX = 100;
const CANVASY = 100;

function preload() {
    debug.log(DP5,'preload()');
    debug.indent(DP5);

    preloadLogin();
    preloadLobby();
    preloadGame();

    //photo = loadImage('xmas.jpg');

    debug.unindent(DP5);
}

function setup() {
    debug.log(DP5,'setup()');
    debug.indent(DP5);

    myCanvas = createCanvas(1000, 563);
    myCanvas.parent('leinwand');
    myCanvas.position(CANVASX,CANVASY);
    myCanvas.class("lemon");


    debug.log(DP5,'setup() erzeugt new SocketLayer()');
    new SocketLayer();

    noStroke();
    fill(255,0,0,120);

    StageManager.getManager();

    debug.unindent(DP5);
}

function draw(){
    //debug.log(DP5,'draw()');
    //debug.indent(DP5);

    StageManager.getManager().draw();

    //debug.unindent(DP5);
}

function mousePressed(){
    if (mouseX>=0&&mouseY>=0&&mouseX<=width&&mouseY<=height) {
        debug.log(DP5,'mousePressed() --> if(true)');
        debug.indent(DP5);

        StageManager.getManager().mousePressed();

        debug.unindent(DP5);
    }
}

function keyPressed(){
    debug.log(DP5,'keyPressed()');
    debug.indent(DP5);
    StageManager.getManager().keyPressed();
    debug.unindent(DP5);
}

function closing(){
    debug.log(DP5,'closing()');
    debug.indent(DP5);

    StageManager.getManager().closingStage();

    debug.unindent(DP5);
}



