import {MAppConfig} from "../AppConfig";
import {Log} from "../core/log/Log";
import UserModel from "../model/UserModel";
import {Message} from "../view/notice/Message";
import {ADHelp} from "./ADHelp";
import {IPlatformSDK} from "./IPlatformSDK";

export class QGMiniSDK implements IPlatformSDK {
    private bannerAd;
    private _isLogin = false;

    async init(): Promise<void> {
    }

    loginAsync(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.login((res) => {
                resolve(res)
            })
        });
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
        console.log("视频广告3");
        let videoAd = qg.createRewardedVideoAd({
            adUnitId: '387498'
        });
        console.log("视频广告4", videoAd);
        videoAd.onLoad(function() {
            console.log('激励视频加载成功')
            videoAd.show()
        });

        videoAd["onClose"](function(res) {
            callback(res.isEnded);
        });

        videoAd.onError(function(err) {
            callback(false);
            console.log(err)
        });
        videoAd.load();
    }

    public login(callback: Function): void {
        let obj: any = {};
        obj.success = (res) => {
            if (res.data && res.data.token) {
                Log.l('获取Token成功 Token = ' + res.data.token, "QGMiniSDK");
                let url: string = MAppConfig.phpRoot + "api.php?cmd=10000&code=" + res.data.token;
                let xhr: Laya.HttpRequest = new Laya.HttpRequest();
                xhr.http.timeout = 10000; //设置超时时间
                xhr.send(url, null, "get");
                xhr.once(Laya.Event.COMPLETE, this, (json) => {
                    let data = JSON.parse(json);
                    if(data.code == 0){
                        let openid = data.data.openid;
                        UserModel.getInstance().userdata = data.data.userinfo;
                        Log.l('OpenID获取成功:' + openid, "QGMiniSDK ||" + UserModel.getInstance().userdata);
                        this._isLogin = true;
                        callback(openid);
                    }else{
                        Log.l('登录失败:' + data.msg, "QGMiniSDK");
                        Message.show('登录失败:' + data.msg)
                        this._isLogin = false;
                        callback(null);
                    }
                });
            } else {
                Log.l('登录失败:' + res.errMsg, "QGMiniSDK");
                this._isLogin = false;
                Message.show('登录失败:' + res.errMsg)
                callback(null);
            }
        }
        obj.fail = (res)=> {
            console.log(JSON.stringify(res))
            Message.show(JSON.stringify(res));
        }
        qg.login(obj);
    }

    public isLogin():boolean{
        return this._isLogin;
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

  
}