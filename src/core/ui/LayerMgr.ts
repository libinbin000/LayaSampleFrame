import { Singleton } from "../common/Singleton";

export class LayerMgr extends Singleton{
    public mainLayer:Laya.Sprite;    //主ui层
    public gameLayer:Laya.Sprite;    //游戏场景层
    public dialogLayer:Laya.Sprite;  //dialog层
    public tipLayer:Laya.Sprite;     //飘字层

    constructor(){
        super();
        this.mainLayer = new Laya.Sprite();
        this.mainLayer.zOrder = 100;
        Laya.stage.addChild(this.mainLayer);
        this.gameLayer = new Laya.Sprite();
        this.gameLayer.zOrder = 200;
        Laya.stage.addChild(this.gameLayer);
        this.dialogLayer = new Laya.Sprite();
        this.dialogLayer.zOrder = 300;
        Laya.stage.addChild(this.dialogLayer);
        this.tipLayer = new Laya.Sprite();
        this.tipLayer.zOrder = 400;
        Laya.stage.addChild(this.tipLayer);
    }
}