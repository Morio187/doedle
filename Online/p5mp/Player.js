const keyW = 'key w';
const keyS = 'key s';
const keyA = 'key a';
const keyD = 'key d';





class Player {

    constructor(id,sdu){
        this.id=id;
        this.G = 0.01;
        this.speed={x:0,y:0};
        this.hasWon = false;
        this.hasLost = false;

        debug.log(DConstructor,'Konstruktor Player['+id+']',this);
        debug.indent(DConstructor);

        this.update(sdu);

        debug.unindent(DConstructor);
    }

    update = function(pdu){
        debug.log(DPlayer,'update('+JSON.stringify(pdu)+')',this);
        debug.indent(DPlayer);

        let aktSDU = pdu.sdu;

        switch(pdu.pci.selector){
            case allSelector: this.updateAll(aktSDU);break;
            case partSelector: this.updatePart(aktSDU);break;
            default: console.error('Player.update: Selector not found: '+pdu.pci.selector);
        }

        debug.unindent(DPlayer);
    }

    updateAll = function(sdu){
        debug.log(DPlayer,'updateAll('+JSON.stringify(sdu)+')',this);
        debug.indent(DPlayer);

        this.color     = sdu.color;
        this.rotation  = sdu.rot;
        this.position  = sdu.position;
        this.initials  = sdu.initials;
        this.speed     = sdu.speed;
        this.hasWon    = sdu.hasWon;
        this.hasLost    = sdu.hasLost;

        debug.log(DPlayer,'updateAll this='+JSON.stringify(this),this);
        debug.log(DPlayer,'updateAll this.initials='+this.initials,this);
        debug.log(DPlayer,'updateAll sdu.initials='+sdu.initials,this);

        debug.unindent(DPlayer);
    }

    sendAllSDU = function(){
        debug.log(DPlayer,'sendAllSDU',this);
        return({pci:{selector:allSelector},sdu:{initials:this.initials , color:this.color , position:this.position , speed:this.speed , rot:this.rotation, hasWon:this.hasWon, hasLost:this.hasLost}});
    }

    updatePart = function(sdu){
        debug.log(DPlayer,'updatePart',this);
        debug.indent(DPlayer);

        this.rotation  = sdu.rot;
        this.position  = sdu.position;
        this.speed     = sdu.speed;
        this.hasWon    = sdu.hasWon;
        this.hasLost    = sdu.hasLost;

        debug.unindent(DPlayer);
    }

    sendPartSDU = function(sdu){
        debug.log(DPlayer,'sendPartSDU',this);
        return({pci:{selector:partSelector},sdu:{position:this.position , speed:this.speed, rot:this.rotation, hasWon:this.hasWon, hasLost:this.hasLost}});
    }

    send = function(sendSelector){
        debug.log(DPlayer,'send',this);
        debug.indent(DPlayer);

        switch(sendSelector){
            case allSelector:
                ObjManager.getManager().sendUpdateObj(
                    new PDU(new PCIObj(this.id,playerClass),this.sendAllSDU()));
                break;
            case partSelector:
                ObjManager.getManager().sendUpdateObj(
                    new PDU(new PCIObj(this.id,playerClass),this.sendPartSDU()));
                break;
            default: console.error('Player.send: Selector not found: '+sendSelector);
        }

        debug.unindent(DPlayer);
    }



    draw = function(){
        debug.log(DPlayer,'send',this);
        debug.indent(DPlayer);

        let alpha = 0;
        let alpha2 = 20;
        let alpha3 = 255;
        if (!this.hasWon&&!this.hasLost){
            alpha = 255;
            alpha2 = 100;
            alpha3 = 200;
        }
        fill(255,alpha-120);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.rotation*2*PI/360.0);
        noStroke();
        triangle(-20,20,20,20,0,-20);
        stroke(this.color.red,this.color.green,this.color.blue,alpha);
        line(-20,20,0,-20);
        line(20,20,0,-20);
        strokeWeight(3);
        stroke(this.color.red,this.color.green,this.color.blue,alpha);
        fill(this.color.red,this.color.green,this.color.blue,alpha2);
        rectMode(CENTER);
        ellipse(0,-20,50,20);
        fill(this.color.red,this.color.green,this.color.blue,alpha2);
        ellipse(0,-20,10,10);
        ellipse(-15,-20,10,10);
        ellipse(15,-20,10,10);

        fill(255,120,120,alpha2);
        ellipse(0,0,50,50);
        pop();

        fill(120,alpha3);
        textAlign(CENTER,CENTER);
        textSize(18);
        text(this.initials,this.position.x,this.position.y);

        debug.unindent(DPlayer);
    }


    gameStep = function(){
        debug.log(DPlayer,'send',this);
        debug.indent(DPlayer);

        if (!this.hasWon&&!this.hasLost) {
            this.position.x = this.position.x + this.speed.x;
            this.position.y = this.position.y + this.speed.y;
            this.gravity();
            this.push2canvas();

            let idDist = GameManager.getManager().minDistance(this.id,this.position);
            if (idDist.minDistance<55){
                this.loose();
                ObjManager.getManager().get(idDist.id).loose();
                ObjManager.getManager().get(idDist.id).send(partSelector);
            }
        }

        debug.unindent(DPlayer);
    }

     gameControl = function(ctrl){
         debug.log(DPlayer,'gameControl ctrl='+ctrl,this);
         debug.indent(DPlayer);

         if (!this.hasWon&&!this.hasLost) {
             switch (ctrl) {
                 case keyW:
                     this.speed.y = this.speed.y - cos(this.rotation * 2 * PI / 360.0);
                     this.speed.x = this.speed.x + sin(this.rotation * 2 * PI / 360.0);
                     break;
                 case keyS:
                     this.speed.y = this.speed.y + 1;
                     break;
                 case keyA:
                     this.rotation = this.rotation + 3;
                     if (this.rotation > 360) this.rotation = this.rotation - 360.0;
                     break;
                 case keyD:
                     this.rotation = this.rotation - 3;
                     if (this.rotation < 0) this.rotation = this.rotation + 360.0;
                     break;
                 default:
                     console.error('player.gameControl unknown ctrl=' + ctrl);
             }
         }

         debug.unindent(DPlayer);
     }


     gravity = function(){
         debug.log(DPlayer,'send',this);
         this.speed.y = this.speed.y + this.G;
    }
     push2canvas = function(){
         debug.log(DPlayer,'send',this);
         debug.indent(DPlayer);

         if (this.position.x <20) {
            this.position.x  = 20;
            this.loose();
            //vX = 0.0;
        }
        if (this.position.x >width-10) {
            this.position.x  = width-10;
            this.loose();
            //vX = 0.0;
        }
        if (this.position.y <10) {
            this.position.y = 10;
            this.loose();
            //vY = 0.0;
        }
        if (this.position.y>height-10) {
            this.position.y = height-10;
            this.loose();
            //vY = 0.0;
        }

        debug.unindent(DPlayer);
    }


    getID = function(){
        return(this.id);
    }
    setColor = function(r,g,b){
        debug.log(DPlayer,'setColor',this);
        this.color = new ColorRGB(r,g,b);
    }

    setPosition = function(pos){
        debug.log(DPlayer,'setPosition('+pos.x+','+pos.y+')',this);
        this.position = pos;
    }

    getPosition = function(){
        debug.log(DPlayer,'getPosition',this);
        return(this.position);
    }

    getSpeed = function(){
        debug.log(DPlayer,'getSpeed',this);
        return(this.speed);
    }

    setSpeed = function(speed){
        debug.log(DPlayer,'setSpeed('+speed.x+','+speed.y+')',this);
        this.speed = speed;
    }
    getRotation = function(){
        debug.log(DPlayer,'getRotation',this);
        return(this.rotation);
    }

    setRotation = function(rot){
        debug.log(DPlayer,'setRotation('+rot+')',this);
        this.rotation = rot;
    }

    win = function(){
        this.hasWon = true;
        if(myself.getID()==this.id) this.send(partSelector);
    }

    getHasWon = function() {
        return (this.hasWon);
    }

    loose = function(){
        this.hasLost = true;
        if(myself.getID()==this.id) this.send(partSelector);
    }

    getHasLost = function() {
        return (this.hasLost);
    }



    toString = function(){
        //return('player['+this.id+'](hasLost='+this.hasLost+', rot='+this.rotation+', speed='+this.speed.x+','+this.speed.y+')');
        return('player['+this.id+']');

    }

}