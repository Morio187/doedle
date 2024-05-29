/*
function setup() {
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = -5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "black";
  background(200);
  ellipse(width/2, height/2, 50, 50);
}
*/


let photo;
let myCanvas;

//let rotation = 0.0;
let vX = 0.0;
let vY = 0.0;
let aktX = 0;
let aktY = 0;


let zustandFigur = 0;
let zustandTimer = 0;
let zustandTimerMax = 10;

let zustandPlattformMax = 10;
let zustandTimerP = 0;

var platform = new Platform();

let zustandSpiel  = 0;

let lastzustand ="";

function preloadLander() {

}


function setupLander() {
  //myCanvas = createCanvas(1000, 563);
  //myCanvas.parent('myContainer');
  noStroke();
  fill(255,0,0);
 // myCanvas.position(100,250);
  myCanvas.class("lemon");
  textSize(32);

  aktX = myself.getPosition().x;
  aktY = myself.getPosition().y;
  myself.setRotation(0);
} 


function drawLander() {
/*  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = -5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "black";
*/
  background(photo);

  showText();

    ObjManager.getManager().gameStep();

    platform.check(myself.getPosition(),myself.getSpeed(),myself.getRotation());

  // Zeichne alle bekannten Objekte
    ObjManager.getManager().draw();
    platform.draw();

    if (platform.isTouchDown()) myself.win();

}



function showText() {
    fill(120);
    if (myself.getHasWon()) {
        textSize(24);
        text("Gewonnen !!!", 150, 40);
        //    text("Gew:"+lastzustand,20,40);
        //    text("vX = "+vX+"; vY = "+vY+"; rotation = "+rotation+"; zustandP = "+zustandPlattform+
        //         "; zustandFigur = "+zustandFigur,20,70);
    } else {
        if (myself.getHasLost()) {
            textSize(24);
            text("Verloren !!!", 150, 40);
        } else {
            textSize(12);
            text("beschleunigen: 'w' , links drehen: 'a' , rechts drehen: 'd'", 150, 40);
            text("Lande behutsam auf der Plattform.", 150, 70);
            //    text("vX = "+vX+"; vY = "+vY+"; rotation = "+rotation,20,40);
        }
    }
}



function keyPressedLander(){
    let ctrl = null;
    if (key=='w') ctrl=keyW;
    if (key=='s') ctrl=keyS;
    if (key=='a') ctrl=keyA;
    if (key=='d') ctrl=keyD;
    if (ctrl!=null) {
        myself.gameControl(ctrl);
        myself.send(partSelector);
    }
}


function mousePressedLander() {
    let ctrl = null;
    if ((mouseX>width/3) && (mouseX<2*width/3)) ctrl=keyW;
    if (key=='s') ctrl=keyS;
    if (mouseX<width/3) ctrl=keyA;
    if (mouseX>2*width/3) ctrl=keyD;
    if (ctrl!=null) {
        myself.gameControl(ctrl);
        myself.send(partSelector);
    }
}



function setzeAufPlattform(){
   lastzustand = "vX="+vX+"; vY="+vY+"; rot="+myself.getRotation()+"; aktX="+aktX+"; aktY="+aktY;
   aktY = height - 30 - 20;
   myself.setRotation(0.0);
}

