import { Log } from "../log/Log";
import { ConfigBase } from "./ConfigBase";


export class ConfigManager {
	private static loadFileList: Array < string > = null;
	private static allConfigMap = {};

	public static loadAllConfigFile(handler: Laya.Handler, progress: Laya.Handler = null) {
		//这里列入要加载的配置表
		this.loadFileList = [
		];
		Laya.loader.load(this.loadFileList, handler, progress);
	}


	/**
	 * 读取某个表中所有数据
	 * @param tType T类
	 * @return 
	 * @example let allTestCfg = GetAllConfig<TestCfg>(TestCfg);
	 */
	public static GetConfig < T extends ConfigBase > (tType: {new(): T}): Map < any, T > {
		let configName: string = new tType().configName();
		if (this.allConfigMap[configName] == null) {
			//加载单张表 用到再加载
			this.allConfigMap[configName] = {};
			let path = this.getTablePathByName(configName);
			let objJson: Object = Laya.loader.getRes(path);
			let map: Map < any, T > = new Map();
			if (objJson == null) {
				Log.e(`获取配置${configName}失败，需要在loadAllConfigFile中加载文件`, "ConfigManager");
			}
			
			for (const key in objJson) {
				let obj = new tType();
				let key1 = obj.parse(objJson[key]);
				if (map.has(key1)) {
					Log.w(`配置表[${configName}]Key=${key1}重复`, "ConfigManager");
				}
				map.set(key1, obj);
			}
			this.allConfigMap[configName] = map;
		}
		return this.allConfigMap[configName];
	}

	public static GetConfigByKey<T extends ConfigBase>(tType:{new():T}, key:any):T{
		return this.GetConfig<T>(tType).get(key);
	}

	private static getTablePathByName(name: string): string {
		let str:string = "res/config/" + name.substr(3) + ".json";
		return "res/config/" + name.substr(3) + ".json";
	}

	private static getConfigFilePath < T extends ConfigBase > (tType: {new(): T}): string {
		let configName: string = new tType().configName();
		return this.getTablePathByName(configName);
	}
}