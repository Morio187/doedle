
//service
const connectSrv = "Srv-Connect";          // Begrüßungsdienst
const brdcastSrv = "Srv-Brdcast";        // Broadcast-Dienst
const disconnectSrv = "Srv-Quit";      // Verabschiedungsdienst
const registerSrv = "Srv-Register";      // Registrierungsdienst


//msgtype
const nullType = 'T-null';
const updateObjType = 'T-fUpdateObj';
const changeStageType = 'T-changeStage';


class PCI {
    constructor(service,msgtype){
        debug.log(DConstructor,'Konstruktor PCI('+service+','+msgtype+')',this);
        debug.indent(DConstructor);

        this.service = service;
        this.msgtype = msgtype;

        debug.unindent(DConstructor);
    }

}

class PDU {
    constructor(pci,sdu){
        debug.log(DConstructor,'Konstruktor PDU',this);
        debug.indent(DConstructor);
        this.pci = pci;
        this.sdu = sdu;


        //console.log('Console: PDU service='+this.pci.service+' | msgtype='+this.pci.msgtype);
        debug.unindent(DConstructor);
    }

    //toString = function(){
    // return ('PDU service='+this.pci.service+' | msgtype='+this.pci.msgtype);
    // }
}


class GameLayer {

    constructor(socketLayer) {
        debug.log(DConstructor,'Konstruktor GameLayer',this);
        debug.indent(DConstructor);

        this.socketLayer = socketLayer;

        LoginManager.getManager().setGameLayer(this);
        LobbyManager.getManager().setGameLayer(this);
        GameManager.getManager().setGameLayer(this);
        StageManager.getManager().setGameLayer(this);
        ObjManager.getManager().setGameLayer(this);

        this.initState(StateDisconnected.getState());

        debug.unindent(DConstructor);
    }

    // ************************
    // Zustandsverwaltung
    // ************************
    nextState = function (newState) {
        debug.log(DLogin, this.toString() + ".nextState(" + newState + ")");
        this.exitState();
        this.state = newState;
        this.enterState();
    }

    initState = function (newState) {
        debug.log(DLogin, this.toString() + ".initState(" + newState + ")");
        this.state = newState;
        this.enterState();
    }

    enterState = function(){
        this.state.enterState(this);
    }

    exitState = function(){
        this.state.exitState(this);
    }

    // ************************
    // öffentliche Methoden zum Zustandswechsel (Eingabealphabet)
    // ************************
    go2disconnected = function(){
        this.state.go2disconnected(this);
    }

    go2register = function(){
        this.state.go2register(this);
    }

    go2connected = function(){
        this.state.go2connected(this);
    }

    // ************************
    // Verbindungsaufbau zum Server
    // ************************
    connect2server = function(ip,port){
        this.state.connect2server(this,ip,port);
    }

    // ************************
    // Senden und Empfangen von Paketen
    // ************************


    sendRegister = function(sdu) {
        this.state.sendRegister(this,sdu);
    }
    sendUpdateObj = function(sdu) {
        this.state.sendUpdateObj(this,sdu);
    }
    sendChangeStage = function(sdu) {
        this.state.sendChangeStage(this,sdu);
    }

    rcvPacket = function(pdu){
        debug.log(DGameLayer,'processPDU('+JSON.stringify(pdu)+')',this);
        debug.indent(DGameLayer);

        const aktPCI = pdu?.pci;
        const aktSDU = pdu?.sdu;

        const aktService = aktPCI?.service;
        const aktMsgtype = aktPCI?.msgtype;

        switch (aktService){
            case registerSrv:
                LoginManager.getManager().rcvRegister(aktSDU);
                break;
            case connectSrv:
                this.go2register();
                LoginManager.getManager().rcvConnect(aktSDU);
                break;
            case brdcastSrv:
                this.rcvBrdSrv(aktMsgtype, aktSDU);
                break;
            case disconnectSrv:
                ObjManager.getManager().rcvDisconnect(aktSDU);
                break;
            default:
                console.error('processPDU onmessage Service nicht gefunden von Nachricht: pdu='+JSON.stringify(pdu));
        }
        debug.unindent(DGameLayer);
    }


    // interne Methoden zur Paketbehandlung
    rcvBrdSrv = function(msgtype, sdu){
        debug.log(DGameLayer,'processBrdSrv('+msgtype+','+JSON.stringify(sdu)+')',this);
        debug.indent(DGameLayer);

        switch (msgtype){
            case updateObjType:
                ObjManager.getManager().updateObj(sdu);
                break;
            case changeStageType:
                StageManager.getManager().rcvChangeStage(sdu);
                break;
            default:
                console.error('processBrdSrv msgtype nicht gefunden: msgtype='+msgtype);
        }
        debug.unindent(DGameLayer);
    }

    connect2serverDo = function(ip,port){
        this.socketLayer.connect2server(ip,port);
    }

    sendUpdateObjDo = function(sdu){
        debug.log(DGameLayer,'sendUpdateObj('+JSON.stringify(sdu)+')',this);
        debug.indent(DGameLayer);

        const pdu = new PDU(new PCI(brdcastSrv,updateObjType),sdu);

        this.sendPDU(pdu);

        debug.unindent(DGameLayer);
    }

    sendChangeStageDo = function(sdu){
        debug.log(DGameLayer,'sendChangeStage('+JSON.stringify(sdu)+')',this);
        debug.indent(DGameLayer);

        const pdu = new PDU(new PCI(brdcastSrv,changeStageType),sdu);

        this.sendPDU(pdu);

        debug.unindent(DGameLayer);
    }

    sendRegisterDo = function(sdu){
        debug.log(DGameLayer,'sendRegister('+JSON.stringify(sdu)+')',this);
        debug.indent(DGameLayer);

        const pdu = new PDU(new PCI(registerSrv,nullType),sdu);

        this.sendPDU(pdu);

        debug.unindent(DGameLayer);
    }

    sendPDU = function(pdu){
        debug.log(DGameLayer,'sendPDU('+JSON.stringify(pdu)+')',this);
        debug.indent(DGameLayer);

        this.socketLayer.send(pdu);

        debug.unindent(DGameLayer);
    }

    toString = function(){
        return ('gameLayer');
    }
}