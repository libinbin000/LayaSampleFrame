import { Singleton } from "../common/Singleton";
import { GameDispatcher } from "../../event/EventDispatcher";

export class Controller extends Singleton{
    protected dispatcher:GameDispatcher;
    constructor(){
        super();
        this.dispatcher = GameDispatcher.getInstance();
    }
}