import { Log } from "./core/log/Log";
import { HttpHelper } from "./core/net/HttpHelper";

export class MAppConfig{
    //是否使用远程配置，如果开启则加载php上的配置
    static isLoadRemoteConfig = true;
    //远程配置文件目录
    static remoteConfigPath = "";
    //version.json
    static versionJson = "version.json";
    //日志等级
    static logLevel =  "info";
    //日志忽略
    static logIgnore = "ModelPool, XXX";
    static logAlway = "";
    //php根目录
    static phpRoot = "";
    //远程资源路径
    static remoteUrl = "";
    //分享标题
    static shareTitle = "";
    //分享图片地址
    static shareImage = "loading/share.png";
    //打开分享界面多长时间算分享成功
    static shareSuccessTime = 4001;                                             
    //是否开启GM按钮
    static isOpenGM = false;

    static isOpenCoin = true;
    static isOpenNpcCar = true;

    static async init(){
    
        if(!this.isLoadRemoteConfig){
            Log.l("使用本地配置");
        }else{
            let [isOk, data] = await HttpHelper.getAsync(this.remoteConfigPath);
            if(!isOk){
                console.log("加载远程配置失败",data);
            }else{
                let config = JSON.parse(data);
                for(let key in config){
                    MAppConfig[key] = config[key]; 
                }
                Log.l("使用远程游戏配置" + data, "AppConfig");
            }
        }
        //声音
        Laya.SoundManager.autoReleaseSound = false;
        Laya.SoundManager.useAudioMusic = true;
        
        //日志模块配置
        Log.setLevel(MAppConfig.logLevel);
        Log.setIgnoreTag(MAppConfig.logIgnore.split(","));
        Log.setAlwayShowTag(MAppConfig.logAlway.split(","));

     
    }
}