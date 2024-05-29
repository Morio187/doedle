


class LobbyManager {
    constructor() {
        debug.log(DConstructor,'Konstruktor LobbyManager',this);
        debug.indent(DConstructor);
        this.isMaster = false;
        this.wasMaster = false;

        debug.unindent(DConstructor);
    }

    static getManager = function () {
        if (this.manager == null) {
            this.manager = new LobbyManager();
        }
        return this.manager;
    }

    setGameLayer = function(gameLayer){
        this.gameLayer = gameLayer;
    }

    startRound = function(){
        this.wasMaster = this.isMaster;
        this.isMaster = ProfileManager.getManager().getMaster();
    }

    newMaster = function(){
        return(this.isMaster && !this.wasMaster);
    }

    resignedMaster = function(){
        return(!this.isMaster && this.wasMaster);
    }


    toString = function(){
        return ("lobbyManager");
    }
}