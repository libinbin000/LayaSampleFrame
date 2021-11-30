export enum LogLevel{
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NOT = 4
}

export class Log{
    private static level:LogLevel = LogLevel.INFO;
    private static ignoreTags:Map<string, boolean> = new Map();  //加入该列表的tag将不打印
    private static alwayShowTags:Map<string, boolean> = new Map(); //加入该列表的tag无视LogLevel打印
    public static l(msg:string, tag:string = ""){
        if(this.isIgnoreTag(tag)){
            return;
        }

        if(this.level > LogLevel.INFO && !this.isAlwayShowTag(tag)){
            return;
        }
        console.log(`[${Laya.timer.currFrame}][${tag}] ${msg}`);
    }

    public static w(msg:string, tag:string = ""){
        if(this.isIgnoreTag(tag)){
            return;
        }

        if(this.level > LogLevel.WARN && !this.isAlwayShowTag(tag)){
            return;
        }
        console.warn(`[${Laya.timer.currFrame}][${tag}] ${msg}`);
    }

    public static e(msg:string, tag:string = ""){
        if(this.isIgnoreTag(tag)){
            return;
        }

        if(this.level > LogLevel.ERROR && !this.isAlwayShowTag(tag)){
            return;
        }
        console.error(`[${Laya.timer.currFrame}][${tag}] ${msg}`);
    }

    public static setLevel(level:LogLevel | string){
        let l = null;
        if(typeof level == "string"){
            let levellow = level.toLowerCase()
            if(levellow == "info"){
                l = LogLevel.INFO;
            }else if(levellow == "warn"){
                l = LogLevel.WARN;
            }else if(levellow == "error"){
                l = LogLevel.ERROR;
            }else if(levellow == "not"){
                l = LogLevel.NOT;
            }else{
                this.e("日志等级"+ level+"不存在");
            }
        }else{
            l = level as LogLevel;
        }

        this.l("日志等级--" + l.toString(), "Log");
        this.level = l;
    }

    public static setIgnoreTag(tag:string|Array<string>):void{
        if(typeof tag == "string"){
            this.ignoreTags.set(tag, true);
        }else{
            tag.forEach((t)=>this.ignoreTags.set(t,true));
        }
    }

    private static isIgnoreTag(tag:string):boolean{
        return this.ignoreTags.has(tag);
    }

    public static setAlwayShowTag(tag:string|Array<string>):void{
        if(typeof tag == "string"){
            this.alwayShowTags.set(tag, true);
        }else{
            tag.forEach((t)=>this.alwayShowTags.set(t,true));
        }
    }

    private static isAlwayShowTag(tag:string):boolean{
        return this.alwayShowTags.has(tag);
    }
}

