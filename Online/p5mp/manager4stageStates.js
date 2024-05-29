const lobbyTimer = new Timer('lobbyTimer');
lobbyTimerTimeout = function(){
    myself.send(allSelector);
    lobbyTimer.set(lobbyTimerTimeout,2);
}

class State4Stages{
    constructor(name){
        debug.log(DConstructor,'Konstruktor State4Stages',this);
        debug.indent(DConstructor);

        this.name = name;
        this.method = (kontext)=>{};

        debug.unindent(DConstructor);
    }



    // input
    go2login = function(kontext){
        debug.log(DStageManagerState,'go2login',this);
        debug.indent(DStageManagerState);

        console.error("illegal use of "+this.name+".go2login");

        debug.unindent(DStageManagerState);
    }
    go2lobby = function(kontext){
        debug.log(DStageManagerState,'go2lobby',this);
        debug.indent(DStageManagerState);

        console.error("illegal use of "+this.name+".go2lobby");

        debug.unindent(DStageManagerState);
    }
    go2game = function(kontext){
        debug.log(DStageManagerState,'go2game',this);
        debug.indent(DStageManagerState);

        console.error("illegal use of "+this.name+".go2game");

        debug.unindent(DStageManagerState);
    }

    // activity
    drawState = function(kontext){ 	// Aufruf mit jedem Frame, wenn in diesem Zustand
        debug.log(DStageManagerState,'drawState',this);
    }

    mousePressedState = function(kontext){ 	// Aufruf mit jedem Frame, wenn in diesem Zustand
        debug.log(DStageManagerState,'mousePressedState',this);
    }

    keyPressedState = function(kontext){ 	// Aufruf mit jedem Frame, wenn in diesem Zustand
        debug.log(DStageManagerState,'keyPressedState',this);
    }

    enterState = function(kontext){		// Aufruf, wenn der Zustand betreten wird
        debug.log(DStageManagerState,'enterState',this);
    }
    exitState = function(kontext){		// Aufruf, wenn der Zustand verlassen wird
        debug.log(DStageManagerState,'exitState',this);
    }

    // helper
    toString = function(){
        return (this.name);
    }
}

class StateLogin extends State4Stages{
    constructor(name){
        super(name);
        debug.log(DConstructor,'Konstruktor StateLogin',this);
    }
    static getState = function(){
        if (this.state == null){
            this.state = new StateLogin('StateLogin');
        }
        return this.state;
    }
    go2lobby = function(kontext){
        debug.log(DStageManagerState,'go2lobby',this);
        debug.indent(DStageManagerState);

        kontext.nextState(StateLobby.getState());

        debug.unindent(DStageManagerState);
    }

    draw = function(kontext){
        kontext.drawLogin();
    }

    mousePressed = function(kontext){
        debug.log(DStageManagerState,'mousePressed',this);
        debug.indent(DStageManagerState);

        kontext.mousePressedLogin();

        debug.unindent(DStageManagerState);
    }

    keyPressed = function(kontext){
        debug.log(DStageManagerState,'keyPressed',this);
        debug.indent(DStageManagerState);

        kontext.keyPressedLogin();

        debug.unindent(DStageManagerState);
    }

    enterState = function(kontext){
        debug.log(DStageManagerState,'enterState',this);
        debug.indent(DStageManagerState);

        kontext.setupLogin();

        debug.unindent(DStageManagerState);
    }
    exitState = function (kontext) {
        debug.log(DStageManagerState,'exitState',this);
        debug.indent(DStageManagerState);

        kontext.closingLogin();

        debug.unindent(DStageManagerState);
    }
}

class StateLobby extends State4Stages{
    constructor(name){
        super(name);
        debug.log(DConstructor,'Konstruktor StateLobby',this);

    }
    static getState = function(){
        if (this.state == null){
            this.state = new StateLobby('StateLobby');
        }
        return this.state;
    }
    go2game = function(kontext){
        debug.log(DStageManagerState,'go2game',this);
        debug.indent(DStageManagerState);

        kontext.nextState(StateGame.getState());

        debug.unindent(DStageManagerState);
    }

    go2login = function(kontext){
        debug.log(DStageManagerState,'go2login',this);
        debug.indent(DStageManagerState);

        kontext.nextState(StateLogin.getState());

        debug.unindent(DStageManagerState);
    }

    draw = function(kontext){
        kontext.drawLobby();
    }

    mousePressed = function(kontext){
        debug.log(DStageManagerState,'mousePressed',this);
        debug.indent(DStageManagerState);

        kontext.mousePressedLobby();

        debug.unindent(DStageManagerState);

    }

    keyPressed = function(kontext){
        debug.log(DStageManagerState,'keyPressed',this);
        debug.indent(DStageManagerState);

        kontext.keyPressedLobby();

        debug.unindent(DStageManagerState);
    }

    enterState = function(kontext){
        debug.log(DStageManagerState,'enterState',this);
        debug.indent(DStageManagerState);

        kontext.setupLobby();
        lobbyTimer.set(lobbyTimerTimeout,1);

        debug.unindent(DStageManagerState);

    }
    exitState = function (kontext) {
        debug.log(DStageManagerState,'exitState',this);
        debug.indent(DStageManagerState);

        kontext.closingLobby();
        lobbyTimer.reset();

        debug.unindent(DStageManagerState);

    }
}

class StateGame extends State4Stages{
    constructor(name){
        super(name);
    }
    static getState = function(){
        if (this.state == null){
            this.state = new StateGame('StateGame');
        }
        return this.state;
    }
    go2lobby = function(kontext){
        debug.log(DStageManagerState,'go2lobby',this);
        debug.indent(DStageManagerState);

        kontext.nextState(StateLobby.getState());

        debug.unindent(DStageManagerState);
    }

    go2login = function(kontext){
        debug.log(DStageManagerState,'go2login',this);
        debug.indent(DStageManagerState);

        kontext.nextState(StateLogin.getState());

        debug.unindent(DStageManagerState);
    }

    draw = function(kontext){
        kontext.drawGame();
    }

    mousePressed = function(kontext){
        debug.log(DStageManagerState,'mousePressed',this);
        debug.indent(DStageManagerState);

        kontext.mousePressedGame();

        debug.unindent(DStageManagerState);
    }

    keyPressed = function(kontext){
        debug.log(DStageManagerState,'keyPressed',this);
        debug.indent(DStageManagerState);

        kontext.keyPressedGame();

        debug.unindent(DStageManagerState);
    }

    enterState = function(kontext){
        debug.log(DStageManagerState,'enterState',this);
        debug.indent(DStageManagerState);

        kontext.setupGame();

        debug.unindent(DStageManagerState);
    }
    exitState = function (kontext) {
        //console.log(this.name+".exitState("+kontext+")");
        //kontext.nix();
    }
}

