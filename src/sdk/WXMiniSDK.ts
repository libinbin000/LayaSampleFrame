import { MAppConfig } from "../AppConfig";
import { Log } from "../core/log/Log";
import { GameDispatcher } from "../event/EventDispatcher";
import { EventName } from "../event/EventName";
import { Message } from "../view/notice/Message";
import { IPlatformSDK } from "./IPlatformSDK";
import { EPlatform } from "./PlatformAdapter";
import MiniAdpter = Laya.MiniAdpter;

export class WXMiniSDK implements IPlatformSDK {
    private isOnShare = false;
    private shareCallback = null;
    private shareStartTime = 0;
    private _isLogin = false;

    private videoAd:any = null;
    private videoAdCallback:Function = null;
    private bannerAd:any = null;
    private gridAd:any = null;
    private gamePortal:any = null;
    private gameIconID:any = null;
    private gameBanner:any = null;
    
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
        var sys: _getSystemInfoSyncReturnValue = wx.getSystemInfoSync();

        // //初始化广告相关的方法
        // this.videoAd = wx["createRewardedVideoAd"]({adUnitId:AppConfig.wxRewardedVideoAdID});
        // console.log("广告实例",this.videoAd);
        // this.videoAd.onClose((res) => {
        //     GameDispatcher.getInstance().event(EventName.BACK_GAME_VIEW);
        //     this.videoAdCallback(res.isEnded);
        // });
        // this.videoAd.onError((res) =>{
        //     console.error("广告加载失败",res);
        //     this.videoAdCallback(false);
        // });
        // //banner广告
        // this.bannerAd = wx["createBannerAd"]({
        //     adUnitId: AppConfig.wxBannerAdID,
        //     style: {
        //       left: sys.windowWidth * 0.1,
        //       top: sys.windowHeight - 120,
        //       width: sys.windowWidth * 0.8
        //     }
        // });
        // this.bannerAd.onError((res)=>{console.error("banner广告错误",res)});
        
        // //格子广告
        // this.gridAd = wx["createGridAd"]({
        //     adUnitId: 'adunit-985c4931da15d05a',
        //     adTheme: 'white',
        //     gridCount: 5,
        //     style: {
        //         left:sys.windowWidth/2 - 150,width:300,top:sys.windowHeight-130,opacity:0.8
        //     }
        // });
        // this.gridAd.onError((res)=>{console.error("格子广告错误",res)});
 

        // //推荐弹窗
        // this.gamePortal = wx["createGamePortal"]({adUnitId:AppConfig.wxGamePortalID});
        // this.gamePortal.onError((res) =>{console.error("推荐浮窗广告错误",res)});
        // // 创建推荐位实例，提前初始化
        // this.gameIconID = wx["createGameIcon"]({adUnitId: AppConfig.wxGameIconID, count:1,style:[{appNameHidden:true,left:20, top:550 / Laya.stage.height * sys.windowHeight}]});
        // this.gameIconID.onError((res) =>{console.error("推荐图标广告错误",res)});
        // // // //推荐banner
        // // this.gameBanner = wx["createGameBanner"]({adUnitId: AppConfig.wxBannerAdID, style: {left:10, top:sys.windowHeight - 300}});
        // // this.gameBanner.onError((res) =>{console.error("推荐Banner错误",res)});
        // Laya.MiniAdpter.nativefiles.push("/sound");
        // Laya.MiniAdpter.nativefiles.push("/test");
    }

    //显示格子广告
    public showGridAD(){
        this.gridAd.hide();
        this.gridAd.show().catch((err) => {
            console.error(err)
        });
    }

    //影藏格子广告
    public hideGridAD(){
        this.gridAd.hide();
    }

    //Banner
    public showBannerAD(){
        if (this.bannerAd) {
            this.bannerAd.show().catch((err) => {
              console.error(err)
            })
        }
    }

    //影藏banner
    public hideBannerAD(){
        if (this.bannerAd) {
            this.bannerAd.hide().catch((err) => {
              console.error(err)
            })
        }
    }

  


    public async loginAsync(): Promise < any > {
        return new Promise((resolve, reject) => {
            this.login((res) => {
                resolve(res)
            })
        });
    }

    public async getUserInfoAsync(): Promise < any > {
        return new Promise((resolve, reject) => {
            this.checkUserInfo((res) => {
                resolve(res);
            });
        });
    }

    public async shareAsync(): Promise < boolean > {
        return new Promise((resolve, reject) => {
            this.share((isOk) => {
                resolve(isOk);
            })
        });
    }

    public share(callback: Function): void {
        this.isOnShare = true;
        this.shareCallback = callback;
        this.shareStartTime = Date.now();
        var object = {
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
        obj.success = (res) => {
            if (res.code) {
                Log.l('获取Code成功 Code = ' + res.code, "WXMiniSDK");
                let url: string = MAppConfig.phpRoot + "api.php?cmd=10000&code=" + res.code;
                let xhr: Laya.HttpRequest = new Laya.HttpRequest();
                xhr.http.timeout = 10000; //设置超时时间
                xhr.send(url, null, "get");
                xhr.once(Laya.Event.COMPLETE, this, (json) => {
                    let data = JSON.parse(json);
                    if(data.code == 0){
                        let openid = data.data.openid;
                        Log.l('OpenID获取成功:' + openid, "WXMiniSDK");
                        this._isLogin = true;
                        callback(openid);
                    }else{
                        Log.l('登录失败:' + data.msg, "WXMiniSDK");
                        Message.show('登录失败:' + data.msg)
                        this._isLogin = false;
                        callback(null);
                    }
                });
            } else {
                Log.l('登录失败:' + res.msg, "WXMiniSDK");
                this._isLogin = false;
                Message.show('登录失败:' + res.errMsg)
                callback(null);
            }
        }
        wx.login(obj);
    }

    // 查看是否授权
    private async checkUserInfo(callback: Function) {
        let paramO: any = {};
        paramO.withSubscriptions = true;
        paramO.success = (res: any) => {
            //trace("调用微信接口getSetting成功="+res,",userinfo="+res.authSetting['scope.userInfo']);
            if (res.authSetting['scope.userInfo']) {
                this.getUserInfo(callback);
            } else {
                this.createLoginButtom(callback);
            }
        }
        wx.getSetting(paramO);
    }

    private async getUserInfo(callback: Function) {
        let param1: any = {};
        param1.success = (res: _getUserInfoSuccessObject) => {
            // var headimg:String = res.userInfo.avatarUrl;
            // var nickname:String = res.userInfo.nickName;
            Log.l("调用微信接口getUserInfog成功,nickname=" + res, "WXMiniSDK");
            callback(res);
        };
        param1.fail = (res: any) => {
            Log.l("调用微信接口getUserInfo失败=" + res, "WXMiniSDK");
            callback(res);
        };
        wx.getUserInfo(param1);
    }

    createLoginButtom(callback: Function): void {
        let sysInfo = wx.getSystemInfoSync();
        let wxVersion: String = sysInfo.SDKVersion;
        //获取微信界面大小
        let wWidth: number = sysInfo.screenWidth;
        let wHeight: number = sysInfo.screenHeight;
        const button = wx["createUserInfoButton"]({
            type: 'text',
            text: '微信登陆',
            style: {
                left: 0,
                top: 0,
                width: wWidth,
                height: wHeight,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#ffffff00',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        })
        button.onTap((res) => {
            // 此处可以获取到用户信息
            Log.l("授权成功=" + res.nickname, "WXMiniSDK");
            button.destroy();
            callback(res);
        })
    }

    
    showVideoAd(callback: Function): void {
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

    public isLogin():boolean{
        return this._isLogin;
    }
}