

export class WebSocket{
    private socket:Laya.Socket = null;

    constructor(){}

    public connect(host:string, port:number):void{
        let socket:Laya.Socket = new Laya.Socket();
        socket.connect(host, port);
        
        socket.on(Laya.Event.OPEN, this, this.onOpen);
        socket.on(Laya.Event.MESSAGE, this, this.onMessage);
        socket.on(Laya.Event.CLOSE, this, this.onClose);
        socket.on(Laya.Event.ERROR, this, this.onError);
    }

    private onOpen(event):void{
        console.log(event);
    }
    
    private onMessage(msg):void{
        console.log(msg);
    }

    private onClose(e):void{
        console.log(e);
    }

    private onError(e):void{
        console.log(e);
    }
}