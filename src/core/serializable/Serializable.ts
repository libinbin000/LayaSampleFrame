export class Serializable{
	private defaultSaveKey:string = "";
	constructor(){
		this.defaultSaveKey = `SaveData3DCar.${this["constructor"].name}`;
	}

	public getJson():string{
		return JSON.stringify(this);
	}

	public setJson(json:string):void{
		if(json == null || json == "")return;
		let obj:any = JSON.parse(json);
		let thisobj:any = this;
		for(let key in obj){
			thisobj[key] = obj[key]; 
		}
	}

	//存档
	public save():void{
		localStorage.setItem(this.getSaveKey() ,this.getJson());
	}

	//读档
	public load():void{
		var str:string = localStorage.getItem(this.getSaveKey());
		this.setJson(str);
	}

	//虚方法返回存储key值
	public getSaveKey():string{
		return this.defaultSaveKey;
	}
}