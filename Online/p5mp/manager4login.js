// Konfiguration des Servers
const myPort = 7071;

class LoginManager {
    constructor() {
        debug.log(DConstructor,'Konstruktor LoginManager',this);
        debug.indent(DConstructor);

        this.connectionStateMsg = 'Wir sind nicht mit dem Server verbunden.';
        //this.ip = 'localhost';
        this.ip = location.hostname;
        this.port = myPort;
        this.connectionRejected = false;

        debug.unindent(DConstructor);
    }

    static getManager = function () {
        if (this.manager == null) {
            this.manager = new LoginManager();
        }
        return this.manager;
    }

    setGameLayer = function(gameLayer){
        debug.log(DLoginManager,'setGameLayer',this);
        debug.indent(DLoginManager);

        this.gameLayer = gameLayer;

        debug.unindent(DLoginManager);
    }

    setIP = function(ip){
        debug.log(DLoginManager,'setIP',this);
        debug.indent(DLoginManager);

        this.ip = ip;

        debug.unindent(DLoginManager);
    }

    getIP = function(){
        debug.log(DLoginManager,'getIP',this);
        return(this.ip);
    }

    setConnectionRejected =function(){
        debug.log(DLoginManager,'setConnectionRejected',this);
        debug.indent(DLoginManager);

        this.connectionRejected = true;

        debug.unindent(DLoginManager);
    }
    resetConnectionRejected =function(){
        debug.log(DLoginManager,'resetConnectionRejected',this);
        debug.indent(DLoginManager);

        this.connectionRejected = false;

        debug.unindent(DLoginManager);
    }
    getConnectionRejected = function(){
        debug.log(DLoginManager,'resetConnectionRejected',this);

        return(this.connectionRejected);
    }
    connect2server = function(){
        debug.log(DLoginManager,'connect2server() ip='+this.ip+' port='+this.port,this);
        debug.indent(DLoginManager);

        this.gameLayer.connect2server(this.ip,this.port);

        debug.unindent(DLoginManager);
    }


    sendRegister = function(nickname,initials){

    }

    rcvRegister = function(sdu){
        debug.log(DLoginManager,'rcvRegister',this);
        debug.indent(DLoginManager);

        let isRegistered = sdu?.isRegistered;
        let isNickname = sdu?.isNickname;
        let isInitials = sdu?.isInitials;
        let isFull = sdu?.isFull;

        if (isRegistered) {
            ProfileManager.getManager().setRegistered();
            this.gameLayer.go2connected();
            StageManager.getManager().go2lobby();
        } else {
            let reason = 'Ablehnung der Verbindung aus folgenden Gruenden: ';
            if (isNickname) {reason = reason + '(Nickname doppelt) ';}
            if (isInitials) {reason = reason + '(Initialen doppelt) ';}
            if (isFull) {reason = reason + '(Lobby voll)';}
            this.gameLayer.go2disconnected();
            LoginManager.getManager().connectionStateMsg = reason;
            LoginManager.getManager().setConnectionRejected();
        }

        debug.unindent(DLoginManager);
    }

    rcvConnect = function(sdu){
        debug.log(DLoginManager,'rcvConnect',this);
        debug.indent(DLoginManager);

        ProfileManager.getManager().setID(sdu.id);
        ProfileManager.getManager().setColor(new ColorRGB(sdu.color[0],sdu.color[1],sdu.color[2]));

        this.gameLayer.sendRegister({'id' : ProfileManager.getManager().getID(), 'nickname' : ProfileManager.getManager().getNickname(), 'initials' : ProfileManager.getManager().getInitials()});

        debug.unindent(DLoginManager);
    }

    toString = function(){
        return ("loginManager");
    }
}