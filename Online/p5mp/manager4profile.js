
class ProfileManager {
    constructor() {
        debug.log(DConstructor,'Konstruktor ProfileManager',this);
        debug.indent(DConstructor);

        this.id = -1;
        this.registered = false;
        this.color = new ColorRGB(0,0,0);
        this.initials = "NB";
        this.nickname = "nobody";
        this.isMaster = false;

        debug.unindent(DConstructor);
    }

    static getManager = function () {
        if (this.manager == null) {
            this.manager = new ProfileManager();
        }
        return this.manager;
    }

    setID = function(id){
        debug.log(DProfileManager,'setID id='+id,this);
        debug.indent(DProfileManager);

        this.id = id;

        debug.unindent(DProfileManager);
    }

    getID = function(){
        debug.log(DProfileManager,'getID',this);
        return(this.id);
    }

    setRegistered = function(){
        debug.log(DProfileManager,'setRegistered',this);
        debug.indent(DProfileManager);

        this.registered = true;
        debug.unindent(DProfileManager);
    }

    getRegistered = function(){
        debug.log(DProfileManager,'getRegistered',this);

        return(this.registered);
    }

    setColor = function(col){
        debug.log(DProfileManager,'setColor',this);
        debug.indent(DProfileManager);

        this.color = col;

        debug.unindent(DProfileManager);
    }

    getColor = function(){
        debug.log(DProfileManager,'getColor',this);

        return(this.color);
    }

    setInitials = function(initials){
        debug.log(DProfileManager,'setInitials',this);
        debug.indent(DProfileManager);

        this.initials = initials;

        debug.unindent(DProfileManager);
    }

    getInitials = function(){
        debug.log(DProfileManager,'getInitials',this);

        return(this.initials);
    }

    setNickname = function(nick){
        debug.log(DProfileManager,'setNickname',this);
        debug.indent(DProfileManager);

        this.nickname = nick;

        debug.unindent(DProfileManager);
    }

    getNickname = function(){
        debug.log(DProfileManager,'getNickname',this);
        return(this.nickname);
    }

    setMaster = function(){
        debug.log(DProfileManager,'setMaster',this);
        debug.indent(DProfileManager);

        this.isMaster = true;

        debug.unindent(DProfileManager);
    }

    resetMaster = function(){
        debug.log(DProfileManager,'resetMaster',this);
        debug.indent(DProfileManager);

        this.isMaster = false;

        debug.unindent(DProfileManager);
    }

    getMaster = function(){
        debug.log(DProfileManager,'getMaster',this);

        return(this.isMaster);
    }



    toString = function(){
        return ("profileManager");
    }

}