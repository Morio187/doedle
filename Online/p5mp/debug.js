

// Debug-Konstanten zur Verwaltung von Themen
// Jede Konstante muss eine 2er Potenzen zwischen 2**0 und 2**31 sein
// Themen können mit & kombiniert werden
const DAkt                   = 2**0; // 1
const DState                 = 2**1; // 2
const DLogin                 = 2**2; // 4
const DLobby                 = 2**3; // 8
const DGame                  = 2**4; // 16
const DStage                 = 2**5; // 32
const DPlayer                = 2**6; // 64
const DTimer                 = 2**7; // 128
const DConstructor           = 2**8; // 256
const DP5                    = 2**9; // 512
const DSocketLayer           = 2**10; // 1024
const DPacketLayer           = 2**11; // 2048
const DGameLayer             = 2**12; // 4096
const DGameLayerState        = 2**13; // 8192
const DLoginManager          = 2**14; // 16384
const DLobbyManager          = 2**15; //
const DGameManager           = 2**16; //
const DObjManager            = 2**17; //
const DProfileManager        = 2**18; //
const DStageManager          = 2**19; //
const DStageManagerState     = 2**20; //



// Konfiguration der debug-Ausgabe
const aktTheme =    DAkt | DState | DLogin | DLobby | DGame | DStage | DPlayer | DTimer | DConstructor | DP5 | DSocketLayer |
                            DPacketLayer | DGameLayer | DGameLayerState | DLoginManager | DLobbyManager | DGameManager |
                            DObjManager | DProfileManager | DStageManager | DStageManagerState;
// Beispiel: DAkt | DState bedeutet, dass alle debug-Anweisungen mit den Themen DAkt oder DState ausgegeben werden.
// | DState | DNewLayer

class Debug{
    constructor(){
        this.debugIndent = "";
        this.themeMap = new Map();

        this.themeMap.set(DAkt,'AKT');
        this.themeMap.set(DLogin,'LOGIN');
        this.themeMap.set(DLobby,'LOBBY');
        this.themeMap.set(DGame,'GAME');
        this.themeMap.set(DConstructor,'CONSTR');
        this.themeMap.set(DPlayer,'Player');
        this.themeMap.set(DTimer,'TIMER');
        this.themeMap.set(DSocketLayer,'SOCKET_L');
        this.themeMap.set(DGameLayer,'GAME_L');
        this.themeMap.set(DP5,'P5');
        this.themeMap.set(DGameLayerState,'GAME_L_STATE');
        this.themeMap.set(DLoginManager,'LOGIN-MGT');
        this.themeMap.set(DLobbyManager,'LOBBY-MGT');
        this.themeMap.set(DGameManager,'GAME-MGT');
        this.themeMap.set(DObjManager,'OBJ-MGT');
        this.themeMap.set(DProfileManager,'PROF-MGT');
        this.themeMap.set(DStageManager,'STAGE-MGT');
        this.themeMap.set(DStageManagerState,'STAGE-STATE');


    }
    log = function (...opt) {

        //console.log('Debug.log length='+opt.length);

        if (opt.length == 1 || opt.length == 2 || opt.length == 3){
            let theme = 0;
            let text = "";
            let ref = null;
            if (opt.length==1){
                text  = opt[0];
                //console.log('Debug.log length=1 | text='+text);
            } else {
                if (opt.length==2) {
                    theme = opt[0];
                    text = opt[1];
                    //console.log('Debug.log length=2 | theme='+theme+' | text='+text);
                } else {
                    theme = opt[0];
                    text  = opt[1];
                    ref = opt[2];
                    //console.log('Debug.log length=3 | theme='+theme+' | text='+text+' | ref.toString()='+ref.toString());
                }
            }

            if (aktTheme&theme || theme == 0){
                console.log(this.debugIndent+'('+(this.themeMap.get(theme)!== null ? this.themeMap.get(theme) : theme)+
                ') ['+((ref==null || ref == undefined)?'unknown':ref.toString())+']: '+text);
            }
        } else {
            console.error("debug.log() unerwartete Anzahl Parameter: "+opt.length);
        }
    }

    log2 = function (...opt) {
        if (opt.length == 1 || opt.length == 2 || opt.length == 3){
            let theme = 0;
            let text = "";
            let ref = null;
            if (opt.length==1){
                text  = opt[0];
            } else {
                if (opt.length==2) {
                    theme = opt[0];
                    text = opt[1];
                } else {
                    theme = opt[0];
                    text  = opt[1];
                    ref = opt[2];
                }
            }

            if (aktTheme&theme || theme == 0){
                //console.log('++++('+theme+') ['+ref==null?'unknown':ref?.toString()+']: '+text);
                console.log('++++('+(this.themeMap.get(theme)!== null ? this.themeMap.get(theme) : theme)
                +') ['+((ref==null || ref == undefined)?'unknown':ref.toString())+']: '+text);
            }
        } else {
            console.error("debug.log() unerwartete Anzahl Parameter: "+opt.length);
        }
    }

    error = function(...opt) {
        if (opt.length == 1 || opt.length == 2){
            let theme = 0;
            let text = "";
            if (opt.length==1){
                text  = opt[0];
            } else {
                theme = opt[0];
                text  = opt[1];
            }
            if (aktTheme&theme || theme == 0){
                console.error(this.debugIndent+'('+theme+'): '+text);
            }
        } else {
            console.error("debug.error() unerwartete Anzahl Parameter: "+opt.length());
        }

    }

    indent = function(...opt){
        if (opt.length == 0 || opt.length == 1){
            let theme = 0;
            if (opt.length==1){
                theme = opt[0];
            }
            if (aktTheme&theme || theme == 0) {
                this.debugIndent = this.debugIndent + '  ';
            }
        }
    }

    unindent = function(...opt){
        if (opt.length == 0 || opt.length == 1){
            let theme = 0;
            if (opt.length==1){
                theme = opt[0];
            }
            if (aktTheme&theme || theme == 0) {
                this.debugIndent = this.debugIndent.substring(0,this.debugIndent.length-2);
            } else {
                console.log('*******************debug.unindent(): NOT UNINDENT !!');
            }
        }
    }

}

const debug = new Debug();

