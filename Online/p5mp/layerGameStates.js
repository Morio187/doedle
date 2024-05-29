class LayerGameState{
    constructor(name){
        debug.log(DConstructor,'Konstruktor LayerGameStates',this);
        debug.indent(DConstructor);

        this.name = name;
        debug.unindent(DConstructor);
    }

    // input
    go2register = function(kontext){
        console.error("illegal use of "+this.name+".go2register");
    }
    go2connected = function(kontext){
        console.error("illegal use of "+this.name+".go2connected");
    }
    go2disconnected = function(kontext){
        console.error("illegal use of "+this.name+".go2unconnected");
    }

    // activity
    connect2server = function(kontext,ip,port){ 	// Aufruf mit jedem Frame, wenn in diesem Zustand
        debug.log(DGameLayerState,'connect2server() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }


    sendRegister = function(kontext,msg){ 	// Aufruf mit jedem Frame, wenn in diesem Zustand
        debug.log(DGameLayerState,'sendRegister() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }


    sendUpdateObj = function(kontext,msg){ 	// Aufruf mit jedem Frame, wenn in diesem Zustand
        debug.log(DGameLayerState,'sendUpdateObj() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }

    sendChangeStage = function(kontext,msg){ 	// Aufruf mit jedem Frame, wenn in diesem Zustand
        debug.log(DGameLayerState,'sendUpdateObj() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }


    // Zustandsverwaltung
    enterState = function(kontext){		// Aufruf, wenn der Zustand betreten wird
        debug.log(DGameLayerState,'enterState() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }
    exitState = function(kontext){		// Aufruf, wenn der Zustand verlassen wird
        debug.log(DGameLayerState,'exitState() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }

    // helper
    toString = function(){
        return (this.name);
    }
}

class StateDisconnected extends LayerGameState{
    constructor(name){
        super(name);
        debug.log(DConstructor,'Konstruktor StateDisconnected',this);
        debug.indent(DConstructor);
        debug.unindent(DConstructor);
    }
    static getState = function(){
        if (this.state == null){
            this.state = new StateDisconnected('StateDisconnected');
        }
        return this.state;
    }

    // input
    go2register = function(kontext){
        debug.log(DGameLayerState,'go2register() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);

        kontext.nextState(StateRegister.getState());

        debug.unindent(DGameLayerState);
    }

    // activity
    connect2server = function(kontext,ip,port){
        debug.log(DGameLayerState,'connect2server() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);

        kontext.connect2serverDo(ip,port);

        debug.unindent(DGameLayerState);
    }

    // Zustandsverwaltung
    enterState = function(kontext){
        debug.log(DGameLayerState,'enterState() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }
    exitState = function (kontext) {
        debug.log(DGameLayerState,'exitState() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }
    toString = function(){
        return (this.name);
    }
}

class StateRegister extends LayerGameState{
    constructor(name){
        super(name);
        debug.log(DConstructor,'Konstruktor StateRegister',this);
        debug.indent(DConstructor);
        debug.unindent(DConstructor);
    }
    static getState = function(){
        if (this.state == null){
            this.state = new StateRegister('StateRegister');
        }
        return this.state;
    }

    // input
    go2connected = function(kontext){
        debug.log(DGameLayerState,'go2connected() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);

        kontext.nextState(StateConnected.getState());

        debug.unindent(DGameLayerState);
    }

    go2disconnected = function(kontext){
        debug.log(DGameLayerState,'go2disconnected() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);

        kontext.nextState(StateDisconnected.getState());

        debug.unindent(DGameLayerState);
    }

    // activity
    sendRegister = function(kontext,msg){
        debug.log(DGameLayerState,'sendRegister() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);

        kontext.sendRegisterDo(msg);

        debug.unindent(DGameLayerState);
    }

    // Zustandsverwaltung
    enterState = function(kontext){
        debug.log(DGameLayerState,'enterState() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }
    exitState = function (kontext) {
        debug.log(DGameLayerState,'exitState() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);

    }
    toString = function(){
        return (this.name);
    }
}

class StateConnected extends LayerGameState{
    constructor(name){
        super(name);
        debug.log(DConstructor,'Konstruktor StateConnected',this);
        debug.indent(DConstructor);
        debug.unindent(DConstructor);
    }
    static getState = function(){
        if (this.state == null){
            this.state = new StateConnected('StateConnected');
        }
        return this.state;
    }

    // input
    go2disconnected = function(kontext){
        debug.log(DGameLayerState,'go2disconnected() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);

        kontext.nextState(StateDisconnected.getState());

        debug.unindent(DGameLayerState);
    }

    sendUpdateObj = function(kontext,msg){
        debug.log(DGameLayerState,'sendUpdateObj() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);

        kontext.sendUpdateObjDo(msg);

        debug.unindent(DGameLayerState);
    }

    sendChangeStage = function(kontext,msg){
        debug.log(DGameLayerState,'sendChangeStage() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);

        kontext.sendChangeStageDo(msg);

        debug.unindent(DGameLayerState);
    }

    // Zustandsverwaltung
    enterState = function(kontext){
        debug.log(DGameLayerState,'enterState() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);

    }
    exitState = function (kontext) {
        debug.log(DGameLayerState,'exitState() kontext='+kontext.toString(),this);
        debug.indent(DGameLayerState);
        debug.unindent(DGameLayerState);
    }
    toString = function(){
        return (this.name);
    }
}
