export class GameDispatcher extends Laya.EventDispatcher
{
    private static _instance:GameDispatcher = new GameDispatcher();
    	
    public static getInstance():GameDispatcher{
        return this._instance;
    }

    protected constructor(){
        super();
    }
}