import { MAppConfig } from "../AppConfig";
import { Log } from "../core/log/Log";
import { GameDispatcher } from "../event/EventDispatcher";
import { EventName } from "../event/EventName";
import { Message } from "../view/notice/Message";
import { IPlatformSDK } from "./IPlatformSDK";

export class QQMiniSDK implements IPlatformSDK {
    init(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    loginAsync(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUserInfoAsync(): Promise<_getUserInfoSuccessObject> {
        throw new Error("Method not implemented.");
    }
    shareAsync(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    share(callback: Function): void {
        throw new Error("Method not implemented.");
    }
    showVideoAd(callback: Function): void {
        throw new Error("Method not implemented.");
    }

    // private isOnShare = false;
    // private shareCallback = null;
    // private shareStartTime = 0;
    // private _isLogin = false;

    // private videoAd:any = null;
    // private videoAdCallback:Function = null;
    // private bannerAd:any = null;
    // private interstitialAd:any = null;
    // private blockAd:any = null;
    // private boxAd:any = null;

    // private gamePortal:any = null;
    // private gameIconID:any = null;
    // private gameBanner:any = null;

    // private lastInterstitialAdTime:number = 0;


    // public async init(): Promise < void > {
    //     wx["onShow"](()=> {
    //         if(this.isOnShare){
    //             this.isOnShare = false;
    //             this.shareCallback && this.shareCallback(Date.now() - this.shareStartTime > MAppConfig.shareSuccessTime);
    //         }
    //         GameDispatcher.getInstance().event(EventName.BACK_GAME_VIEW);
    //         Laya.timer.scale = 1;
    //     });

    //     wx["onHide"](()=>{
    //         Laya.timer.scale = 0;
    //     });

    //     //位置参数
    //     var sys: _getSystemInfoSyncReturnValue = wx.getSystemInfoSync();

    //     //初始化广告相关的方法
    //     this.videoAd = wx["createRewardedVideoAd"]({adUnitId:MAppConfig.qqRewardedVideoAdID});
    //     console.log("广告实例",this.videoAd);
    //     this.videoAd.onClose((res) => {
    //         GameDispatcher.getInstance().event(EventName.BACK_GAME_VIEW);
    //         this.videoAdCallback(res.isEnded);
    //     });
    //     this.videoAd.onError((res) =>{
    //         console.error("广告加载失败",res);
    //         this.videoAdCallback(false);
    //     });
    //     //banner广告
    //     this.bannerAd = wx["createBannerAd"]({
    //         adUnitId: MAppConfig.qqBannerAdID,
    //         style: {
    //           left: sys.windowWidth * 0.1,
    //           top: sys.windowHeight - 120,
    //           width: sys.windowWidth * 0.8
    //         }
    //     });
    //     this.bannerAd.onError((res)=>{console.error("banner广告错误",res)});
        
    //     //插屏广告
    //     this.interstitialAd = wx["createInterstitialAd"]({adUnitId:MAppConfig.qqInterstitialAdID});
    //     this.interstitialAd.onError((res) =>{
    //         console.log("插屏广告加载失败",res);
    //     })

    //     //积木广告
    //     this.blockAd = wx["createBlockAd"]({  
    //          adUnitId:MAppConfig.qqBlockAdID,
    //          style:{left:0,top:Laya.stage.height / 2},
    //          size:5,
    //          orientation:"landscape"
    //     });
    //     this.blockAd.onError((res) =>{
    //         console.log("积木广告加载失败",res);
    //     })

    //     //盒子广告
    //     this.boxAd = wx["createAppBox"]({
    //         adUnitId:MAppConfig.qqBoxAdID
    //     })
    //     this.boxAd.onError((res) =>{
    //         console.log("盒子广告加载失败",res);
    //     })

    //     //推荐弹窗
    //    // this.gamePortal = wx["createGamePortal"]({adUnitId:AppConfig.qqGamePortalID});
    //     //this.gamePortal.onError((res) =>{console.error("推荐浮窗广告错误",res)});
    //     // 创建推荐位实例，提前初始化
    //     //this.gameIconID = wx["createGameIcon"]({adUnitId: AppConfig.qqGameIconID, count:1,style:[{appNameHidden:true,left:20, top:550 / Laya.stage.height * sys.windowHeight}]});
    //     //this.gameIconID.onError((res) =>{console.error("推荐图标广告错误",res)});
    //     Laya.QQMiniAdapter.nativefiles.push("/sound");
    //     Laya.QQMiniAdapter.nativefiles.push("/test");
    // }

   
    // //Banner
    // public showBannerAD(){
    //     if (this.bannerAd) {
    //         this.bannerAd.show().catch((err) => {
    //           console.error(err)
    //         })
    //     }
    // }

    // //影藏banner
    // public hideBannerAD(){
    //     if (this.bannerAd) {
    //         this.bannerAd.hide();
    //     }
    // }

    // //图标样式广告
    // public showGameIcon(){
    //     if (this.gameIconID) {
    //         this.gameIconID.load().then(() => {
    //             this.gameIconID.show()
    //         }).catch((err) => {
    //             console.error(err)
    //         })
    //     }
    // }

    // //图标样式广告
    // public hideGameIcon(){
    //     if (this.gameIconID) {
    //         this.gameIconID.hide();
    //     }
    // }

    // //显示浮层样式
    // public showGamePortal(){
    //     if(this.gamePortal) {
    //         this.gamePortal.load().then(() => {
    //             this.gamePortal.show()
    //         }).catch((err) => {
    //             console.error(err)
    //         });
    //     }
    // }


    // public async loginAsync(): Promise < any > {
    //     return new Promise((resolve, reject) => {
    //         this.login((res) => {
    //             resolve(res)
    //         })
    //     });
    // }
    // public async getUserInfoAsync(): Promise < any > {
    //     return new Promise((resolve, reject) => {
    //         this.checkUserInfo((res) => {
    //             resolve(res);
    //         });
    //     });
    // }

    // public async shareAsync(): Promise < boolean > {
    //     return new Promise((resolve, reject) => {
    //         this.share((isOk) => {
    //             resolve(isOk);
    //         })
    //     });
    // }

    // public share(callback: Function): void {
    //     this.isOnShare = true;
    //     this.shareCallback = callback;
    //     this.shareStartTime = Date.now();
    //     var object = {
    //         title: MAppConfig.shareTitle,
    //         imageUrl: MAppConfig.shareImage,
    //         // query: ,
    //     };
    //     wx["shareAppMessage"](object);
    // }

    // public postMessage(message: any) {
    //     wx["getOpenDataContext"]().postMessage(message);
    // }
    // public login(callback: Function): void {
    //     let obj: any = {};
    //     obj.success = (res) => {
    //         if (res.code) {
    //             Log.l('获取Code成功 Code = ' + res.code, "QQMiniSDK");
    //             let url: string = MAppConfig.phpRoot + "api.php?cmd=10000&code=" + res.code;
    //             let xhr: Laya.HttpRequest = new Laya.HttpRequest();
    //             xhr.http.timeout = 10000; //设置超时时间
    //             xhr.send(url, null, "get");
    //             xhr.once(Laya.Event.COMPLETE, this, (json) => {
    //                 let data = JSON.parse(json);
    //                 console.log(json);
    //                 if(data.code == 0){
    //                     let openid = data.data.openid;
    //                     Log.l('OpenID获取成功:' + openid, "QQMiniSDK");
    //                     this._isLogin = true;
    //                     callback(openid);
    //                 }else{
    //                     Log.l('登录失败:' + data.msg, "QQMiniSDK");
    //                     Message.show('登录失败:' + data.msg)
    //                     this._isLogin = false;
    //                     callback(null);
    //                 }
    //             });
    //         } else {
    //             Log.l('登录失败:' + res.msg, "QQMiniSDK");
    //             this._isLogin = false;
    //             Message.show('登录失败:' + res.errMsg)
    //             callback(null);
    //         }
    //     }
    //     wx.login(obj);
    // }

    // // 查看是否授权
    // private async checkUserInfo(callback: Function) {
    //     let paramO: any = {};
    //     paramO.withSubscriptions = true;
    //     paramO.success = (res: any) => {
    //         if (res.authSetting['scope.userInfo']) {
    //             this.getUserInfo(callback);
    //         } else {
    //             this.createLoginButtom(callback);
    //         }
    //     }
    //     wx.getSetting(paramO);
    // }

    // private async getUserInfo(callback: Function) {
    //     let param1: any = {};
    //     param1.success = (res: _getUserInfoSuccessObject) => {
    //         Log.l("调用QQ接口getUserInfog成功,nickname=" + res, "QQMiniSDK");
    //         callback(res);
    //     };
    //     param1.fail = (res: any) => {
    //         Log.l("调用QQ接口getUserInfo失败=" + res, "QQMiniSDK");
    //         callback(res);
    //     };
    //     wx.getUserInfo(param1);
    // }

    // createLoginButtom(callback: Function): void {
    //     let sysInfo = wx.getSystemInfoSync();
    //     let wxVersion: String = sysInfo.SDKVersion;
    //     //获取微信界面大小
    //     let wWidth: number = sysInfo.screenWidth;
    //     let wHeight: number = sysInfo.screenHeight;
    //     const button = wx["createUserInfoButton"]({
    //         type: 'text',
    //         text: '微信登陆',
    //         style: {
    //             left: 0,
    //             top: 0,
    //             width: wWidth,
    //             height: wHeight,
    //             lineHeight: 40,
    //             backgroundColor: '#00000000',
    //             color: '#ffffff00',
    //             textAlign: 'center',
    //             fontSize: 16,
    //             borderRadius: 4
    //         }
    //     })
    //     button.onTap((res) => {
    //         // 此处可以获取到用户信息
    //         Log.l("授权成功=" + res.nickname, "QQMiniSDK");
    //         button.destroy();
    //         callback(res);
    //     })
    // }
    // showVideoAd(callback: Function): void {
    //     this.videoAdCallback = callback;
    //     // 显示广告
    //     this.videoAd.show().then(() => {
    //         console.log("广告显示成功");
    //     }).catch((err) => {
    //         console.log("广告组件出现问题", err);
    //         // 可以手动加载一次
    //         this.videoAd.load().then(() => {
    //             console.log("手动加载成功");
    //             // 加载成功后需要再显示广告
    //             return this.videoAd.show();
    //         });
    //     });
    // }

    // showInterstitialAd():void{
    //     if(Laya.Browser.now() - this.lastInterstitialAdTime < 30000){
    //         console.log("插屏广告CD--", Laya.Browser.now() - this.lastInterstitialAdTime)
    //         return;
    //     }
    //     this.lastInterstitialAdTime = Laya.Browser.now();
    //     this.interstitialAd && this.interstitialAd.destory && this.interstitialAd.destory();
    //     this.interstitialAd = wx["createInterstitialAd"]({
    //         adUnitId: MAppConfig.qqInterstitialAdID,
    //     });
    //     this.interstitialAd && this.interstitialAd
    //         .load()
    //         .then(() => {
    //             this.interstitialAd.show();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    // showBoxAd():void{
    //     this.boxAd && this.boxAd.destory && this.boxAd.destory();
    //     this.boxAd = wx["createAppBox"]({
    //         adUnitId: MAppConfig.qqBoxAdID,
    //     });
    //     this.boxAd && this.boxAd
    //         .load()
    //         .then(() => {
    //             this.boxAd.show();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
    // showBlockAd():void{
    //     this.blockAd && this.blockAd.destory && this.blockAd.destory();
    //     this.blockAd = wx["createBlockAd"]({
    //         adUnitId:MAppConfig.qqBlockAdID,
    //         style:{left:0,top:Laya.stage.height / 2},
    //         size:5,
    //         orientation:"landscape"
    //     });
    //     this.blockAd && this.blockAd
    //         .load()
    //         .then(() => {
    //             this.blockAd.show();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
    // public isLogin():boolean{
    //     return this._isLogin;
    // }
}
