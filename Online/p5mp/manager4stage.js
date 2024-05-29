const loginStage = 'loginStage';
const lobbyStage = 'lobbyStage';
const gameStage = 'gameStage';


class StageManager{
    constructor(state){
        debug.log(DConstructor,'Konstruktor StageManager',this);
        debug.indent(DConstructor);

        this.initState(state);

        debug.unindent(DConstructor);
    }

    static getManager = function(){
        if (this.manager == null){
            this.manager = new StageManager(StateLogin.getState());
        }
        return this.manager;
    }

    setGameLayer = function(gameLayer){
        debug.log(DStageManager,'setGameLayer',this);
        debug.indent(DStageManager);

        this.gameLayer = gameLayer;

        debug.unindent(DStageManager);
    }

    nextState = function(newState){
        debug.log(DStageManager,'nextState newState='+newState.toString(),this);
        debug.indent(DStageManager);

        this.exitState();
        this.state = newState;
        this.enterState();

        debug.unindent(DStageManager);
    }

    initState = function(newState){
        debug.log(DStageManager,'initState newState='+newState.toString(),this);
        debug.indent(DStageManager);

        this.state = newState;
        this.enterState();

        debug.unindent(DStageManager);
    }

    go2login = function(){
        debug.log(DStageManager,'go2login',this);
        debug.indent(DStageManager);

        this.state.go2login(this);

        debug.unindent(DStageManager);
    }

    go2lobby = function(){
        debug.log(DStageManager,'go2lobby',this);
        debug.indent(DStageManager);

        this.state.go2lobby(this);

        debug.unindent(DStageManager);
    }

    go2game = function(){
        debug.log(DStageManager,'go2game',this);
        debug.indent(DStageManager);

        this.state.go2game(this);

        debug.unindent(DStageManager);
    }

    enterState = function(){
        debug.log(DStageManager,'enterState',this);
        debug.indent(DStageManager);

        this.state.enterState(this);
        debug.unindent(DStageManager);
    }

    exitState = function(){
        debug.log(DStageManager,'exitState',this);
        debug.indent(DStageManager);

        this.state.exitState(this);

        debug.unindent(DStageManager);
    }

    draw = function(){
        this.state.draw(this);
    }

    mousePressed = function(){
        debug.log(DStageManager,'mousePressed',this);
        debug.indent(DStageManager);

        this.state.mousePressed(this);

        debug.unindent(DStageManager);
    }

    keyPressed = function(){
        debug.log(DStageManager,'keyPressed',this);
        debug.indent(DStageManager);

        this.state.keyPressed(this);

        debug.unindent(DStageManager);
    }

    setupLogin = function(){
        debug.log(DStageManager,'setupLogin',this);
        debug.indent(DStageManager);

        setupLogin();

        debug.unindent(DStageManager);
    }

    setupLobby = function(){
        debug.log(DStageManager,'setupLobby',this);
        debug.indent(DStageManager);

        setupLobby();

        debug.unindent(DStageManager);
    }

    setupGame = function(){
        debug.log(DStageManager,'setupGame',this);
        debug.indent(DStageManager);

        setupGame();

        debug.unindent(DStageManager);
    }

    drawLogin = function(){
        drawLogin();
    }

    drawLobby = function(){
        drawLobby();
    }

    drawGame = function(){
        drawGame();
    }

    mousePressedLogin = function(){
        debug.log(DStageManager,'mousePressedLogin',this);
        debug.indent(DStageManager);

        mousePressedLogin();

        debug.unindent(DStageManager);
    }

    mousePressedLobby = function(){
        debug.log(DStageManager,'mousePressedLobby',this);
        debug.indent(DStageManager);

        mousePressedLobby();

        debug.unindent(DStageManager);
    }

    mousePressedGame = function(){
        debug.log(DStageManager,'mousePressedGame',this);
        debug.indent(DStageManager);

        mousePressedGame();

        debug.unindent(DStageManager);
    }

    keyPressedLogin = function(){
        debug.log(DStageManager,'keyPressed',this);
        debug.indent(DStageManager);

        keyPressedLogin();

        debug.unindent(DStageManager);
    }

    keyPressedLobby = function(){
        debug.log(DStageManager,'keyPressedLobby',this);
        debug.indent(DStageManager);

        keyPressedLobby();
    }

    keyPressedGame = function(){
        debug.log(DStageManager,'keyPressedGame',this);
        debug.indent(DStageManager);

        keyPressedGame();

        debug.unindent(DStageManager);
    }

    closingLogin = function(){
        debug.log(DStageManager,'closingLogin',this);
        debug.indent(DStageManager);

        closingLogin();

        debug.unindent(DStageManager);
    }

    closingLobby = function(){
        debug.log(DStageManager,'closingLobby',this);
        debug.indent(DStageManager);

        closingLobby();

        debug.unindent(DStageManager);
    }

    closingGame = function(){
        debug.log(DStageManager,'closingGame',this);
        debug.indent(DStageManager);

        closingGame();

        debug.unindent(DStageManager);
    }


    rcvChangeStage = function(sdu){
        debug.log(DStageManager,'rcvChangeStage',this);
        debug.indent(DStageManager);

        switch (sdu.stage){
            case loginStage: this.go2login(); break;
            case lobbyStage: this.go2lobby(); break;
            case gameStage: this.go2game(); break;
        }

        debug.unindent(DStageManager);

    }

    sendChangeStage = function(nextStage){
        debug.log(DStageManager,'sendChangeStage',this);
        debug.indent(DStageManager);

        this.gameLayer.sendChangeStage({stage:nextStage});

        debug.unindent(DStageManager);
    }


    toString = function(){
        return ("stageManager");
    }
}
