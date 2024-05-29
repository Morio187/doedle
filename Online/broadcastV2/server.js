//**** Diese Konfigurationen muss identisch im Client/Server-Programm erscheinen

// Konfiguration des Servers
const myPort = 7071;

//service
const connectSrv = "Srv-Connect";          // Begrüßungsdienst
const brdcastSrv = "Srv-Brdcast";        // Broadcast-Dienst
const disconnectSrv = "Srv-Quit";      // Verabschiedungsdienst
const registerSrv = "Srv-Register";      // Registrierungsdienst


//msgtype
const nullType = 'T-null';

class PDU {
    constructor(service,msgtype,sdu){
        console.log('Konstruktor PDU('+service+','+msgtype+')');
        this.pci =   {'service':service, 'msgtype':msgtype};
        this.sdu = sdu;
    }

    toString = function(){
        return ('PDU service='+service+' | msgtype='+msgtype);
    }
}

//**** Ende des Konfigurationsabschnitts


const WebSocket = require('ws');
const myWebServerSocket = new WebSocket.Server({ port: myPort });

const clients = new Map();
const unregisteredClients = new Map();


// Node.js program to demonstrate the
// os.networkInterfaces() Method

// Allocating os module
const os = require('os');

// Print os.networkInterfaces() value
var net_int = os.networkInterfaces();

let myLocalIPs ="";

for (var key in net_int) {
    //console.log(key);
    var net_infos=net_int[key];

    let currIP = net_infos.find(elem => (elem.family=='IPv4'&&elem.address!=='127.0.0.1'));

    let currIPStr = currIP!==undefined ? JSON.stringify(currIP.address) : '';
    myLocalIPs = currIPStr == '' ? myLocalIPs : (myLocalIPs == '' ? currIPStr : myLocalIPs +' ; '+currIPStr);

}

console.log('IPv4-Adresse(n) des Servers im lokalen Netzwerk: '+myLocalIPs);
console.log('Port des Servers: '+myPort);



// Eventhandler für ein Connection-Event der Webserversocket
// Der Eventhandler besitzt einen Parameter: die aktuelle Websocket
myWebServerSocket.on('connection', (aktuelleWebsocket) => {

    [...clients.keys()].forEach((socket) => {
        if (socket == myWebServerSocket) {console.log('gleiche Sockets gefunden');}
      });

    // jeder Teilnehmer wird über seine Websocket erkannt

    // erzeuge für diesen Teilnehmer eine eindeutige ID
    const aktID = idGen();

    console.log('new client('+aktID+'): '+aktuelleWebsocket.readyState+' (0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)');

    // erzeuge für diesen Teilnehmer eine zufällige Farbe
    const aktColor = [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)];
    
    // merk dir die Zuordnung websocket -> (id,color)
    const aktParticipant = { id : aktID, color : aktColor , nickname : '' , initials : ''};
    unregisteredClients.set(aktuelleWebsocket, aktParticipant);

    let newSDU = aktParticipant;
    // begrüße den neuen Teilnehmer mit seiner id und Farbe
    const aktPDU = new PDU(connectSrv,nullType,newSDU);

    const outbound = JSON.stringify(aktPDU);
    console.log('connectSrv Send: pdu='+outbound);
    aktuelleWebsocket.send(outbound);
    
    // Eventhandler für ein Nachrichten-Event der neuen Websocket
    // der Eventhandler besitzt einen Parameter: die aktuelle Nachricht als Zeichenkette 
    aktuelleWebsocket.on('message', (messageAsString) => {
        console.log('on message : pdu='+messageAsString);
        // erstelle ein Objekt aus der Zeichenkette
        const aktPDU = JSON.parse(messageAsString);


        // ermittle alle möglichen Werte, falls diese vorhanden sind
        const aktPCI = (aktPDU !== null && aktPDU.pci !== undefined) ? aktPDU.pci : null;
        const aktSDU = (aktPDU !== null && aktPDU.sdu !== undefined) ? aktPDU.sdu : null;
            
        const aktSrv = (aktPCI !== null && aktPCI.service !== undefined) ? aktPCI.service : null;

        const aktMessage = (aktSDU.message !== undefined) ? aktSDU.message : null;

        // ermittle die Teilnehmerdaten zu der aktuellen Websocket
        const aktParticipant = clients.get(aktuelleWebsocket);

        switch (aktSrv){
            case brdcastSrv:
                // schicke an alle Teilnehmer die Information des Teilnehmers und der Nachricht
                const aktPDUout = aktPDU;
                // { pci : { service : aktSrv }, sdu : { aktSDU } };
                const outbound = JSON.stringify(aktPDUout);
                [...clients.keys()].forEach((client) => {
                    client.send(outbound);
                });
                break;
            case registerSrv:
                const aktId = aktSDU?.id;
                const aktNickname = aktSDU?.nickname;
                const aktInitials = aktSDU?.initials;
                let isNickname = false;
                let isInitials = false;
                let isFull = false;

                clients.forEach((value,key)=>{if(value.nickname === aktNickname) isNickname = true;});
                clients.forEach((value,key)=>{if(value.initials === aktInitials) isInitials = true;});

                const isRegistered = (!isNickname && !isInitials && !isFull);

                let newSDU = {'isRegistered' : isRegistered, 'isNickname' : isNickname, 'isInitials' : isInitials, 'isFull' : isFull};
                const newPDUout = new PDU(aktSrv,nullType,newSDU);
                const newoutbound = JSON.stringify(newPDUout);
                if (isRegistered) {
                    unregisteredClients.get(aktuelleWebsocket).nickname = aktNickname;
                    unregisteredClients.get(aktuelleWebsocket).initials = aktInitials;
                    clients.set(aktuelleWebsocket,unregisteredClients.get(aktuelleWebsocket));
                    unregisteredClients.delete(aktuelleWebsocket);
                }

                aktuelleWebsocket.send(newoutbound);
                console.log('register send : pdu='+newoutbound);
                if (!isRegistered) {
                    unregisteredClients.delete(aktuelleWebsocket);
                    aktuelleWebsocket.close();
                }
                break;
            default:
                console.error('Eventhandler onmessage: Service nicht gefunden, Nachricht: '+messageAsString);
        }
    });


    // Eventhandler für ein Schließen-Event der neuen Websocket
    // kein Parameter
    aktuelleWebsocket.on("close", () => {

      // ermittle die Teilnehmerdaten zu der aktuellen Websocket
      const aktParticipant = clients.get(aktuelleWebsocket);
      if (aktParticipant!==null && aktParticipant!==undefined) {
          console.log('loosing client(' + aktParticipant.id + '): ' + aktuelleWebsocket.readyState + ' (0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)');

          // Teilnehmerinformationen werden gelöscht
          clients.delete(aktuelleWebsocket);
          unregisteredClients.delete(aktuelleWebsocket);

          // alle anderen Teilnehmer werden verständigt
          const newSDU = {'id': aktParticipant.id};
          const aktPDU = new PDU(disconnectSrv,nullType,newSDU);

          const outbound = JSON.stringify(aktPDU);
          [...clients.keys()].forEach((client) => {
              client.send(outbound);
          });
      }
     });
});

// Erzeugung aufeinander folgender ID-Werte (als Zeichenkette)
var idNb = 0;
function idGen() {
  idNb = idNb + 1 ;
  return  idNb ;
}

// Konsolenoutput, um den Status zu sehen
console.log("WebServerSocket läuft!");
