const playerClass = 'PlayerClass';

class PCIObj {
    constructor(id,classType){
        debug.log(DConstructor,'Konstruktor PCIObj('+id+','+classType+')',this);
        debug.indent(DConstructor);

        this.id =   id;
        this.class=classType;

        debug.unindent(DConstructor);
    }

}

class PCIData {
    constructor(selector){
        debug.log(DConstructor,'Konstruktor PCIData('+selector+')',this);
        debug.indent(DConstructor);

        this.selector = selector;

        debug.unindent(DConstructor);
    }

}

class ObjManager {
    constructor() {
        debug.log(DConstructor,'Konstruktor ObjManager',this);
        debug.indent(DConstructor);

        this.objMap = new Map();
        this.sendObjMap = new Map();

        debug.unindent(DConstructor);
    }

    static getManager = function () {
        if (this.manager == null) {
            this.manager = new ObjManager();
        }
        return this.manager;
    }

    setGameLayer = function(gameLayer){
        debug.log(DObjManager,'setGameLayer',this);
        debug.indent(DObjManager);

        this.gameLayer = gameLayer;

        debug.unindent(DObjManager);
    }

    rcvDisconnect = function(sdu){
        debug.log(DObjManager,'rcvDisconnect',this);
        debug.indent(DObjManager);

        this.objMap.delete(sdu.id);
        switch (sdu.clsname) {
            case playerClass:
                GameManager.getManager().deletePlayer(sdu.id);
                break;
        }

        debug.unindent(DObjManager);
    }

    updateObj = function(pdu){
        debug.log(DObjManager,'updateObj',this);
        debug.indent(DObjManager);

        let obj = this.objMap.get(pdu.pci.id);
        if (obj !== null && obj !== undefined) {obj.update(pdu.sdu);}
        else {this.initObj(pdu);}

        debug.unindent(DObjManager);
    }

    initObj = function(pdu){
        debug.log(DObjManager,'initObj('+JSON.stringify(pdu)+')',this);
        debug.indent(DObjManager);

        switch(pdu.pci.class){
            case playerClass:
                debug.log(DObjManager,'initObj case: '+playerClass,this);
                this.objMap.set(pdu.pci.id,new Player(pdu.pci.id,pdu.sdu));
                GameManager.getManager().addPlayer(pdu.pci.id);

                debug.log(DObjManager,'initObj objMap.size='+this.objMap.size,this);
            break;

        }

        debug.unindent(DObjManager);
    }


    get = function(key){
        debug.log(DObjManager,'get',this);
        debug.indent(DObjManager);

        let objValue = this.objMap.get(key);
        if (objValue !== null) return objValue;
        else {
            console.error(this.toString()+'.get('+key+') wurde nicht gefunden.');
            return null;
        }

        debug.unindent(DObjManager);
    }

    send = function(sendSelector){
        debug.log(DObjManager,'send',this);
        debug.indent(DObjManager);

        this.sendObjMap.forEach((value, key) => {
            value.send(sendSelector);
        });

        debug.unindent(DObjManager);
    }

    sendUpdateObj = function(packet){
        debug.log(DObjManager,'sendUpdateObj',this);
        this.gameLayer.sendUpdateObj(packet);
    }

    draw = function(){
        this.objMap.forEach((value, key) => {
            value.draw();
        });
    }

    gameStep = function(){
        this.objMap.forEach((value, key) => {
            value.gameStep();
        });
    }

    toString = function(){
        return ("objManager");
    }

}