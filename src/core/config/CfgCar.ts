import { ConfigBase } from "./ConfigBase";

export class CfgCar extends ConfigBase{
    public id:number = 0;
    public name:string = "";//名字
    public model:string = "";//模型
    public skin:string = "";//皮肤
    public fireSound:string = "";//声音
    public fireSoundLength:number = 0;
    public loopSound:string = "";
    public income:number = 0;//收益
    public consumeMoney:number = 0;//购买该车消耗的金币
    public consumeDiamond:number = 0;//购买该车消耗的钻石
    public carBrand:string = "";//车牌
    public speed:number = 0;//速度
    public power:number = 0;//动力
    public handler:number = 0;//操控性
  

    public parse(data: any): any {
        this.id = data.id;
        this.name = data.name;
        this.model = data.model;
        this.skin = data.skin;
        this.fireSound = data.fireSound;
        this.fireSoundLength = data.fireSoundLength;
        this.loopSound = data.loopSound;
        this.income = data.income;
        this.consumeMoney = data.consumeMoney;
        this.consumeDiamond = data.consumeDiamond;
        this.carBrand = data.carBrand;
        this.speed = data.speed;
        this.power = data.power;
        this.handler = data.handler;
        return this.id;
    }

    public configName():string{
        return "CfgCar";
    }
}