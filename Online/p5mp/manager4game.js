
class GameManager {
    constructor() {
        debug.log(DConstructor,'Konstruktor GameManager',this);
        debug.indent(DConstructor);

        this.playerMap = new Map();
        this.masterID = -1;

        debug.unindent(DConstructor);
    }

    static getManager = function () {
        if (this.manager == null) {
            this.manager = new GameManager();
        }
        return this.manager;
    }

    setGameLayer = function(gameLayer){
        debug.log(DGameManager,'setGameLayer',this);
        debug.indent(DGameManager);

        this.gameLayer = gameLayer;

        debug.unindent(DGameManager);
    }

    addPlayer = function(id){
        debug.log(DGameManager,'addPlayer',this);
        debug.indent(DGameManager);

        this.playerMap.set(id,ObjManager.getManager().get(id));
        this.checkMasterID();

        debug.unindent(DGameManager);
    }

    minDistance = function(id, position){
        debug.log(DGameManager,'addPlayer',this);
        debug.indent(DGameManager);

        let minDist = width;
        let minID = id;
        for (const aktPlayer of this.playerMap.values()) {
            let aktID = aktPlayer.getID();
            if (aktID!==id&&!aktPlayer.getHasLost()&&!aktPlayer.getHasWon()){
                let aktDistance = this.distance(position,aktPlayer.getPosition());
                if (aktDistance < minDist){
                    minDist = aktDistance;
                    minID = aktID;
                }
            }
        }
        return {id:minID,minDistance:minDist};
    }

    distance = function (pos1,pos2){
        return(Math.sqrt((pos1.x-pos2.x)**2+(pos1.y-pos2.y)**2));
    }

    deletePlayer = function(id){
        debug.log(DGameManager,'deletePlayer',this);
        debug.indent(DGameManager);

        this.playerMap.delete(id);
        this.checkMasterID();

        debug.unindent(DGameManager);
    }

    checkMasterID = function(){
        debug.log(DGameManager,'checkMasterID',this);
        debug.indent(DGameManager);

        let minKey = -1;
        for (const x of this.playerMap.keys()) {
            if(minKey<0 || x<minKey) {
                minKey=x;
            }
        }
        this.masterID = minKey;
        if (ProfileManager.getManager().getID() == this.masterID) {
            debug.log(DGameManager,'checkMasterID I am MASTER',this);
            ProfileManager.getManager().setMaster();
        }
        else {
            ProfileManager.getManager().resetMaster();
        }

        debug.unindent(DGameManager);
    }

    toString = function(){
        return ("gameManager");
    }
}