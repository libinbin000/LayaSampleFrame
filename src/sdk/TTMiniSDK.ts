import { MAppConfig } from "../AppConfig";
import { Log } from "../core/log/Log";
import { GameDispatcher } from "../event/EventDispatcher";
import { EventName } from "../event/EventName";
import UserModel from "../model/UserModel";
import { Message } from "../view/notice/Message";
import { IPlatformSDK } from "./IPlatformSDK";
import Browser = Laya.Browser;
import TTMiniAdapter = Laya.TTMiniAdapter;

export class TTMiniSDK implements IPlatformSDK {
    private isOnShare = false;
    private shareCallback = null;
    private shareStartTime = 0;
    private _isLogin = false;
    private _isGetUserInfo = false;
    
    private videoAd:any = null;
    private videoAdCallback:Function = null;
    private interstitialAd:any = null;
    private lastInterstitialAdTime:number = 0;
    private bannerAd:any = null;

    private gameRecorderManager: any;
    private videoPath: any;
    
    public async init(): Promise < void > {
        wx["onShow"](()=> {
            if(this.isOnShare){
                this.isOnShare = false;
                this.shareCallback && this.shareCallback(Date.now() - this.shareStartTime > MAppConfig.shareSuccessTime);
            }
            GameDispatcher.getInstance().event(EventName.BACK_GAME_VIEW);
            Laya.timer.scale = 1;
        });

        wx["onHide"](()=>{
            Laya.timer.scale = 0;
        });

        //位置参数
        var sys: _getSystemInfoSyncReturnValue = window["tt"].getSystemInfoSync();

        //初始化广告相关的方法
        if(wx["createRewardedVideoAd"]){
            this.videoAd = wx["createRewardedVideoAd"]({adUnitId:MAppConfig.ttRewardedVideoAdID});
            console.log("广告实例",this.videoAd);
            this.videoAd.onClose((res) => {
                this.videoAdCallback(res.isEnded);
            });
            this.videoAd.onError((res) =>{
                console.error("广告加载失败",res);
                this.videoAdCallback(false);
            });
        }
        
        //banner广告
        this.bannerAd = wx["createBannerAd"]({
            adUnitId: MAppConfig.ttBannerAdID,
            style: {
                width: sys.windowWidth * 0.8,
                top: sys.windowHeight - (200 / 16) * 9, // 根据系统约定尺寸计算出广告高度,
                left : sys.windowWidth * 0.1
            },
        });
        this.bannerAd.onError((res)=>{console.error("banner广告错误",res)});

        //屏幕录制相关
        this.gameRecorderManager = window["tt"].getGameRecorderManager();
        this.gameRecorderManager.onError((err) => {
            console.log(err)
        });

        //初始化插屏广告
        this.interstitialAd = window["tt"].createInterstitialAd({
            adUnitId: MAppConfig.ttInterstitialAdID,
        });
        this.interstitialAd.onError((err)=>{
            console.log(err);
            // Message.show("请30秒后重试");
        })
        //Laya.TTMiniAdapter.nativefiles.push("/sound");
    }

    public async loginAsync(): Promise < any > {
        return new Promise((resolve, _) => {
            this.login((res) => {
                resolve(res)
            })
        });
    }

    public async getUserInfoAsync(): Promise < any > {
        return new Promise((resolve, _) => {
            this.getUserInfo((res) => {
                resolve(res);
            });
        });
    }

    public async shareAsync(): Promise < boolean > {
        return new Promise((resolve, _) => {
            this.share((isOk) => {
                resolve(isOk);
            })
        });
    }

    public share(callback: Function): void {
        this.isOnShare = true;
        this.shareCallback = callback;
        this.shareStartTime = Date.now();
        let object = {
            title: MAppConfig.shareTitle,
            imageUrl: MAppConfig.shareImage,
            // query: ,
        };
        wx["shareAppMessage"](object);
    }

    public postMessage(message: any) {
        wx["getOpenDataContext"]().postMessage(message);
    }

    public login(callback: Function): void {
        let obj: any = {};
        obj.force = false;              //不强制唤起登陆框
        obj.success = (res) => {
            if (res.code) {
                Log.l('登录成功 Code = ' + res.code, "TTMiniSDK");
                let url: string = MAppConfig.phpRoot + "api.php?type=10000&code=" + res.code;
                let xhr: Laya.HttpRequest = new Laya.HttpRequest();
                xhr.http.timeout = 10000; //设置超时时间
                xhr.send(url, null, "get");
                xhr.once(Laya.Event.COMPLETE, this, (openid) => {
                    Log.l('OpenID获取成功:' + openid, "TTMiniSDK");
                    this._isLogin = true;
                    callback(openid);
                });
            } else {
                Log.l('登录失败:' + res.errMsg, "TTMiniSDK");
                this._isLogin = false;
                callback(res.anonymousCode);
                Message.show('登录失败:' + res.errMsg)
            }
        }
        wx.login(obj);
    }

    public login2(callback: Function): void {
        let obj: any = {};
        obj.success = (res) => {
            if (res.code) {
                Log.l('获取Code成功 Code = ' + res.code, "TTMiniSDK");
                let url: string = MAppConfig.phpRoot + "api.php?cmd=10000&code=" + res.code;
                let xhr: Laya.HttpRequest = new Laya.HttpRequest();
                xhr.http.timeout = 10000; //设置超时时间
                xhr.send(url, null, "get");
                xhr.once(Laya.Event.COMPLETE, this, (json) => {
                    let data = JSON.parse(json);
                    if(data.code == 0){
                        let openid = data.data.openid;
                        Log.l('OpenID获取成功:' + openid, "TTMiniSDK");
                        this._isLogin = true;
                        callback(openid);
                    }else{
                        Log.l('登录失败:' + res.msg, "TTMiniSDK");
                        Message.show('登录失败:' + res.msg)
                        this._isLogin = false;
                        callback(null);
                    }
                });
            } else {
                Log.l('登录失败:' + res.msg, "TTMiniSDK");
                this._isLogin = false;
                Message.show('登录失败:' + res.errMsg)
                callback(null);
            }
        }
        wx.login(obj);
    }

    private async getUserInfo(callback: Function) {
        let param1: any = {};
        param1.success = (res:any) => {
            Log.l("调用微信接口getUserInfo成功,nickname=" + res, "WXMiniSDK");
            UserModel.getInstance().userdata = res.userInfo;
            this._isGetUserInfo = true;
            callback(res);
        };
        param1.fail = (res: any) => {
            Log.l("调用微信接口getUserInfo失败=" + res, "WXMiniSDK");
            callback(false);
        };
        wx.getUserInfo(param1);
    }

    public showVideoAd(callback){
        this.videoAdCallback = callback;
        // 显示广告
        this.videoAd.show().then(() => {
            console.log("广告显示成功");
        }).catch((err) => {
            console.log("广告组件出现问题", err);
            // 可以手动加载一次
            this.videoAd.load().then(() => {
                console.log("手动加载成功");
                // 加载成功后需要再显示广告
                return this.videoAd.show();
            });
        });
    }

    //Banner
    public showBannerAD(){
        if (this.bannerAd) {
            this.bannerAd.show();
        }
    }

    //隐藏banner
    public hideBannerAD(){
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    }

    public showInterstitialAd():void{


        if(Browser.now() - this.lastInterstitialAdTime < 30000){
            console.log("插屏广告CD--", Browser.now() - this.lastInterstitialAdTime)
            return;
        }
        this.lastInterstitialAdTime = Browser.now();

        // 插屏广告支持今日头条和抖音客户端
        this.interstitialAd && this.interstitialAd.destory && this.interstitialAd.destory();
        this.interstitialAd = window["tt"].createInterstitialAd({
            adUnitId: MAppConfig.ttInterstitialAdID,
        });

        this.interstitialAd && this.interstitialAd
            .load()
            .then(() => {
                this.interstitialAd.show();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    //开始录制
    public startRecorder(callback) {
        this.gameRecorderManager.start({
            duration: 300,
            isMarkOpen: true,
            locLeft: 0,
            locTop: 600,
        });

        this.gameRecorderManager.onStart((res) => {
            console.log("开始录制");
            if(callback){   
                callback(res);
            }
        });
    }

    //停止录制
    public stopRecorder(callback) {
        this.gameRecorderManager.onStop((res) => {
            console.log("停止录制" + res.videoPath);
            this.videoPath = res.videoPath;
            if(callback){   
                callback(res);
            }
        });

        this.gameRecorderManager.stop();
    }

    //分享录屏
    public shareRecorder(callback){
        window["tt"].shareAppMessage({
            channel: "video",
            title: MAppConfig.shareTitle,
            description: "",
            extra: {
                videoPath: this.videoPath
            },
            success: function (): void {
                console.log("录屏分享成功------------------------");
                if(callback)callback(true);
            },
            fail: function (): void {
                console.log("录屏分享  失败------------------------");
                if(callback)callback(false);
            }
        });
    }

    //截屏
    public screenShot(callback){
        window["canvas"].toTempFilePath({quality: 0.7,
            fileType: "png",
            destWidth: Laya.stage.width * 0.5,
            destHeight: Laya.stage.height * 0.5,
            success: function(t) {
                if(callback){
                    callback(t.tempFilePath);
                }
            },
            complete: function(_) {
              
            }
      });
    }

    public isLogin():boolean{
        return this._isLogin;
    }

    public isGetUserInfo():boolean{
        return this._isGetUserInfo;
    }
}