let contButton;
let myServerIP;
let myNickname;
let myInitials;

let myself;


function preloadLogin(){

}

function setupLogin(){
    debug.log(DP5,'setupLogin()');
    debug.indent(DP5);

    showForm();

    debug.unindent(DP5);
}

function drawLogin(){
    debug.log(DP5,'drawLogin()');
    debug.indent(DP5);

    if (!LoginManager.getManager().getConnectionRejected()) {background(80,80,255); noLoop();}
    else {LoginManager.getManager().resetConnectionRejected();showForm();}



    debug.unindent(DP5);
}

function mousePressedLogin(){

}

function keyPressedLogin(){

}

function closingLogin(){
    debug.log(DP5,'closingLogin()');
    debug.indent(DP5);

    removeElements();
    loop();

    debug.unindent(DP5);
}


showForm = function(){
    debug.log(DP5,'showForm()');
    debug.indent(DP5);

    background(0);
    fill(255);
    ellipse(width/2,height/2,100,100);


    contButton = createButton('weiter');
    contButton.style('font-size', '20px', 'color', '#ffff00', 'width' , '1000');
    contButton.position(CANVASX, CANVASY+height);
    contButton.mousePressed(
        ()=>{
            debug.log(DP5,'contButton.mousePressed()');
            debug.indent(DP5);

            LoginManager.getManager().setIP(myServerIP.value());

            ProfileManager.getManager().setNickname(myNickname.value());
            ProfileManager.getManager().setInitials(myInitials.value());

            LoginManager.getManager().connect2server();

            debug.unindent(DP5);
            loop();
        }
    );

    let psize= 210;

    let mtxt = createP(LoginManager.getManager().connectionStateMsg);
    mtxt.style('font-size', '20px', 'color', '#ffff00', 'width' , psize);
    mtxt.position(CANVASX,CANVASY+height/8-40);

    let stxt = createP('Server IP-Adresse:');
    stxt.style('font-size', '20px', 'color', '#ffff00', 'width' , psize);
    stxt.position(CANVASX,CANVASY+height/4-40);

    let ntxt = createP('Nickname:');
    ntxt.style('font-size', '20px', 'color', '#ffff00', 'width' , psize);
    ntxt.position(CANVASX,CANVASY+2*height/4-40);

    let itxt = createP('Initialen (2  Buchstaben):');
    itxt.style('font-size', '20px', 'color', '#ffff00', 'width' , psize);
    itxt.position(CANVASX,CANVASY+3*height/4-40);

    myServerIP = createInput(LoginManager.getManager().getIP());
    myServerIP.style('font-size', '20px', 'color', '#ffff00', 'width' , '1000');
    myServerIP.position(CANVASX+psize, CANVASY+height/4-25);

    myNickname = createInput(ProfileManager.getManager().getNickname());
    myNickname.style('font-size', '20px', 'color', '#ffff00', 'width' , '1000');
    myNickname.position(CANVASX+psize, CANVASY+2*height/4-25);

    myInitials = createInput(ProfileManager.getManager().getInitials());
    myInitials.style('font-size', '20px', 'color', '#ffff00', 'width' , '100');
    myInitials.position(CANVASX+psize, CANVASY+3*height/4-25);

    debug.unindent(DP5);

    noLoop();
}


