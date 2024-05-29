class Platform {
    constructor(id){
        this.id = id;
        this.zustandPlattform = 0;
    }

    check = function(position,speed,rotation){
        this.zustandPlattform = 0;
        if (((1.0*width/2 - position.x) < 20) && ((1.0*width/2 - position.x) > -20)) {
            this.zustandPlattform  = 1;
            if (((rotation < 3)||(rotation>357)) && speed.y > -1 && speed.y < 1) {
                this.zustandPlattform =3;
                if (((1.0*height-30 - (position.y+20)) < 2) && ((1.0*height-30 - (position.y+20)) > -2)){
                    this.zustandPlattform =2;

                }
            }
        }
    }

    isTouchDown = function() {
        return (this.zustandPlattform == 2);
    }

    draw = function(){
        switch (this.zustandPlattform){
            case 0: fill(255);
                break;
            case 1: fill(255,0,0);
                break;
            case 2:
            case 3: fill(0,255,0);
                break;
            default: fill(120);
        }
        noStroke();
        rectMode(CENTER);
        rect(width/2,height-20,80,20);
    }



}