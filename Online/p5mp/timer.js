// timer with js
class Timer{
    constructor(name){
        this.name = name;
        debug.log(DConstructor,'Konstruktor Timer',this);
        debug.indent(DConstructor);

        this.timer = null;
        this.timeout = null;
        this.duration = 0;

        debug.unindent(DConstructor);
    }
    set = function (timeout,durationIns,...optObject) {
        debug.log(DTimer,"set Timer duration="+durationIns+'s',this);
        debug.indent(DTimer);

        this.duration = durationIns * 1000;
        this.timeout = timeout;
        this.reset();

        this.timer = window.setTimeout(this.timeout,this.duration,...optObject);

        debug.unindent(DTimer);
    }

    reset = function() {
        debug.log(DTimer,"reset Timer",this);
        debug.indent(DTimer);

        clearTimeout(this.timer);

        debug.unindent(DTimer);
    }

    toString = function(){
        return 'Timer(' + this.name+')';
    }

}


