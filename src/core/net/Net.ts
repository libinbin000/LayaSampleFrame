export class Net{
    private constructor(){}

    private static socket:Laya.Socket = null;
    private static currNum:number = 0;

    public static connect(host:string, port:number):void{
        this.socket = new Laya.Socket();
        this.socket.connect(host, port);
        
        this.socket.on(Laya.Event.OPEN, this, this.onOpen);
        this.socket.on(Laya.Event.MESSAGE, this, this.onMessage);
        this.socket.on(Laya.Event.CLOSE, this, this.onClose);
        this.socket.on(Laya.Event.ERROR, this, this.onError);
    }

    private static onOpen(event):void{
        console.log(event);
    }
    
    private static onMessage(msg):void{
        console.log(msg);
    }

    private static onClose(e):void{
        console.log(e);
    }

    private static onError(e):void{
        console.log(e);
    }
}