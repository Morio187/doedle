

// Der Spiel-Server läuft auf dem Webserver
const serverIPandPort = location.host;
const doppelpunktIdx = serverIPandPort.indexOf(':');
const serverIP = (doppelpunktIdx>0) ? serverIPandPort.substring(0,doppelpunktIdx) : serverIPandPort;

var myWebsocket;

var gameLayer4Socket ;

class SocketLayer {

    constructor(){
        debug.log(DConstructor,'Konstruktor SocketLayer',this);
        debug.indent(DConstructor);

        this.gameLayer = new GameLayer(this);
        gameLayer4Socket = this.gameLayer;

        debug.unindent(DConstructor);
    }


// Interface Control Information: URL des Servers, timeout in ms, Anzahl der Wiederholungen



// Websocket zur Verbindung mit dem Server
    async connect2server(ip,port) {
        this.myICI = {
            url: 'ws://' + ip + ':' + port + '/ws',
            timeoutMs: 1000,
            numberOfRetries: 0
        };

        const aktICI = this.myICI;

        this.initWebsocket(null).then(function (socket) {
            //console.log('---WSocket:'+JSON.stringify(socket));

            // Initialisierung der globale Variable myWebsocket
            debug.log2(DSocketLayer,'\'SocketLyer.connect2server then-part: '+socket.toString(),this);
            myWebsocket = socket;

            // einschalten der draw-loop
            //loop();

            // Eventhandler für die Websocket zur Behandlung eintreffender Nachrichten
            // Eventhandler besitzt einen Parameter: Die übertragene Nachricht als Text (Parameter: webSocketMessage)
            // Der Körper des Eventhandlers steht zwischen den geschweiften Klammern
            socket.onmessage = (webSocketMessage) => {

                // Wandel die Nachricht in eine Objekt mit (Attribut : Attributwert)-Paaren um
                const aktPacket = JSON.parse(webSocketMessage.data);

                gameLayer4Socket.rcvPacket(aktPacket);


            }


        }, function (socket) {
            debug.log2(DSocketLayer,'\'SocketLayer.connect2server else-part: '+socket.toString(),this);
            console.error('Konnte keine Verbindung zum Server herstellen. Vielleicht hilft ein hard reload.');
            LobbyManager.getManager().connectionStateMsg = 'Server nicht gefunden. IP-Adresse neu eingeben.';
            StageManager.getManager().go2login();
            //noLoop();
        });

    }


    /**
     * inits a websocket by a given url, returned promise resolves with initialized websocket, rejects after failure/timeout.
     *
     * @param aktICI der aktuelle Interface enthält:
     *               url the websocket url to init,
     *               timeoutMs the timeout in milliseconds for opening the websocket,
     *               numberOfRetries the number of times initializing the socket should be retried,
     *                  if not specified or 0, no retries are made
     *                     and a failure/timeout causes rejection of the returned promise
     * @param existingWebsocket if passed and this passed websocket is already open, this existingWebsocket is resolved, no additional websocket is opened
     * @return {Promise}
     */
    function

    initWebsocket(existingWebsocket) {
        debug.log2(DSocketLayer,'\'initWebsocket()',this);

        const aktICI = this.myICI;

        const url = aktICI.url;
        var timeoutMs = aktICI.timeoutMs;
        var numberOfRetries = aktICI.numberOfRetries;

        debug.log2(DSocketLayer,'initWebsocket(): url='+url,this);

        timeoutMs = timeoutMs ? timeoutMs : 1500;
        numberOfRetries = numberOfRetries ? numberOfRetries : 0;
        var hasReturned = false;
        var promise = new Promise((resolve, reject) => {
            setTimeout(function () {
                if (!hasReturned) {
                    console.info('opening websocket timed out: ' + url);
                    rejectInternal();
                }
            }, timeoutMs);
            if (!existingWebsocket || existingWebsocket.readyState != existingWebsocket.OPEN) {
                //console.log('Neue Websocket.');
                if (existingWebsocket) {
                    existingWebsocket.close();
                }
                debug.log2(DSocketLayer,'try to open socket: '+url,this);
                var websocket = new WebSocket(url);
                websocket.onopen = function () {
                    debug.log2(DSocketLayer,'socket on open event: '+url,this);
                    if (hasReturned) {
                        websocket.close();
                    } else {
                        console.info('websocket opened! url: ' + url);
                        resolve(websocket);
                    }
                };
                websocket.onclose = function () {
                    console.info('websocket closed! url: ' + url);
                    rejectInternal();
                };
                websocket.onerror = function () {
                    console.info('websocket error! url: ' + url);
                    rejectInternal();
                };
            } else {
                resolve(existingWebsocket);
            }

            function rejectInternal() {
                if (numberOfRetries <= 0) {
                    reject();
                } else if (!hasReturned) {
                    hasReturned = true;
                    console.info('retrying connection to websocket! url: ' + url + ', remaining retries: ' + (numberOfRetries - 1));
                    aktICI.numberOfRetries = aktICI.numberOfRetries - 1;
                    initWebsocket(null).then(resolve, reject);
                }
            }
        });
        promise.then(function () {
            hasReturned = true;
        }, function () {
            hasReturned = true;
        });
        return promise;
    };


    send = function (packet) {
        const outbound = JSON.stringify(packet);
        debug.log2(DSocketLayer,'send()',this);
        debug.log2(DSocketLayer,'*** packet='+outbound,this);

        if (myWebsocket !== null) {
            myWebsocket.send(outbound);
        } else {
            console.error(this.toString() + ".send(" + outbound + '): myWebsocket is null');
        }

    }

    toString = function(){
        return ('socketLayer');
    }

}

