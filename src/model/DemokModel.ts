import {Singleton} from "../core/common/Singleton";
import {DemoSerializable} from "./DemoSerializable";

export class DemokModel extends Singleton {
    private data: DemoSerializable;

    constructor() {
        super();
        this.data = new DemoSerializable();
        this.data.load();
    }

    public saveText(save:string): void {
       this.data.demoText = save;
       this.data.save();
    }

    public getText(): string {
        return this.data.demoText;
    }
}