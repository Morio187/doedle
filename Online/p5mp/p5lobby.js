


// div-Element zur AUsgabe der individuellen ID
const idAnzeige = document.createElement('div');
idAnzeige.style.width = '60px';
idAnzeige.style.height = '20px';
idAnzeige.style.background = 'black';
idAnzeige.style.color = 'white';
//idAnzeige.innerHTML = 'my ID ??';


/**
 * P5-Funktion:
 * Die Funktion preload() wird direkt vor setup() aufgerufen und dient dazu, 
 * das asynchrone Laden externer Dateien auf blockierende Weise zu handhaben. 
 * Wenn eine Preload-Funktion definiert ist, wartet setup() , 
 * bis alle darin enthaltenen Ladeaufrufe abgeschlossen sind. 
 * In der Preload-Funktion sollte sich nichts außer Load-Aufrufen 
 * (loadImage , LoadJSON , LoadFont , LoadStrings usw.) befinden. 
 * 
 * hier:
 * Die Socket für die Verbindung zum Server wird erzeugt.
 * Das Hintergrundbild wird geladen.
 * Die draw-loop wird ausgeschaltet. 
 **/
function preloadLobby() {
    photo = loadImage('image/lunar-rec-orbiter-3.jpg');
}

/**
 * P5-Funktion:
 * Die Funktion setup() wird einmalig beim Programmstart aufgerufen. 
 * Es wird verwendet, um anfängliche Umgebungseigenschaften wie 
 * Bildschirmgröße und Hintergrundfarbe zu definieren und Medien 
 * wie Bilder und Schriftarten zu laden, wenn das Programm startet. 
 * Für jedes Programm kann es nur eine setup()- Funktion geben und 
 * diese sollte nach ihrer ersten Ausführung nicht erneut aufgerufen werden.
 * 
 * hier: 
 * Erstellt die Canvas.
 **/
function setupLobby() {
    debug.log(DP5,'setupLobby()');
    debug.indent(DP5);


    //song =  loadSound('Surf.mp3');

    document.body.appendChild(idAnzeige);


    let aktPCI = {id:ProfileManager.getManager().getID(),class:playerClass}
    let aktSDU = new PDU({selector:allSelector},
        {initials:ProfileManager.getManager().getInitials(),
            color:ProfileManager.getManager().getColor(),
            position :{x:width/2, y:height/2},
            speed :{x:0.0, y:0.0},
            rot:0.0, hasLost:false, hasWon:false});

    ObjManager.getManager().updateObj(
        new PDU(aktPCI,aktSDU)
    );
    myself = ObjManager.getManager().get(ProfileManager.getManager().getID());


    document.body.style.backgroundColor = 'rgb(' +  ProfileManager.getManager().getColor().red + ',' +
    ProfileManager.getManager().getColor().green  + ',' +
    ProfileManager.getManager().getColor().blue + ')';

    idAnzeige.innerHTML = "--"+ProfileManager.getManager().getID()+"--";


    loop();

    debug.unindent(DP5);
}

/**
 * P5-Funktion:
 * Die Funktion draw () wird direkt nach setup() aufgerufen und 
 * führt kontinuierlich die in ihrem Block enthaltenen Codezeilen aus, 
 * bis das Programm gestoppt oder noLoop() aufgerufen wird. 
 * Beachten Sie, dass, wenn noLoop() in setup() aufgerufen wird , 
 * draw() immer noch einmal ausgeführt wird, bevor es angehalten wird. 
 * draw() wird automatisch aufgerufen und sollte niemals explizit aufgerufen werden. 
 * 
 * hier:
 * Zeichne Hintergrundbild.
 * Zeichne die Kreise aller Teilnehmer.
 * Melde die eigenen Koordinaten an den Server.
 **/
function drawLobby() {
    //debug.log(DP5,'drawLobby()');
    //debug.indent(DP5);


    LobbyManager.getManager().startRound();

    // Lege Foto in den Hintergrund
    background(photo);

    // Zeichne alle bekannten Objekte
    ObjManager.getManager().draw();


    // Zeichne einen kleinen roten Kreis für den Benutzer
    fill(255,0,0);
    ellipse(mouseX,mouseY,10,10);


    if (LobbyManager.getManager().newMaster()){
        showButton();
    } else if (LobbyManager.getManager().resignedMaster()){
        deleteButton();
    }

    //debug.unindent(DP5);
}

/**
 * P5-Funktion: 
 * Die Methode „mousePressed()“ wird einmal aufgerufen, 
 * nachdem jedes Mal eine Maustaste über dem Element gedrückt wird. 
 * Einige mobile Browser lösen dieses Ereignis möglicherweise auch auf einem Touchscreen aus, 
 * wenn der Benutzer schnell darauf tippt. Dies kann verwendet werden, 
 * um elementspezifische Ereignis-Listener anzuhängen.
 * 
 * hier: 
 * nix
 **/
function mousePressedLobby() {
    debug.log(DP5,'mousePressedLobby()');
    debug.indent(DP5);

    myself.setPosition(new Position(mouseX,mouseY));
    myself.send(allSelector);

    debug.unindent(DP5);
}



function keyPressedLobby() {
    if (isMaster&key=='s') {
        debug.log(DP5,'keyPressedLobby() --> if(true)');
        debug.indent(DP5);


        debug.unindent(DP5);
    }

}

function closingLobby(){
    debug.log(DP5,'closingLobby()');
    debug.indent(DP5);

    document.body.removeChild(idAnzeige);
    removeElements();

    myself.send(allSelector);

    debug.unindent(DP5);
}

showButton = function() {
    debug.log(DP5,'showButton()');
    debug.indent(DP5);

    contButton = createButton('zum Spiel');
    contButton.style('font-size', '20px', 'color', '#ffff00', 'width', '1000');
    contButton.position(CANVASX, CANVASY + height);
    contButton.mousePressed(
        () => {
            StageManager.getManager().sendChangeStage(gameStage);
        });

    debug.unindent(DP5);
}

deleteButton = function() {
    debug.log(DP5,'deleteButton()');
    debug.indent(DP5);

    removeElements();

    debug.unindent(DP5);
}










