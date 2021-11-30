import {MAppConfig} from "../AppConfig";
import {Singleton} from "../core/common/Singleton";
import {Log} from "../core/log/Log";
import {GameDispatcher} from "../event/EventDispatcher";
import {EventName} from "../event/EventName";
import {SettingModel} from "../model/SettingModel";
import UserModel from "../model/UserModel";
import {LoginView} from "../view/login/LoginView";
import {Message} from "../view/notice/Message";
import {ADHelp} from "./ADHelp";
import {IPlatformSDK} from "./IPlatformSDK";
import {QGMiniSDK} from "./QGMiniSDK";
import {QQMiniSDK} from "./QQMiniSDK";
import {TTMiniSDK} from "./TTMiniSDK";
import {WXMiniSDK} from "./WXMiniSDK";

export enum EPlatform {
    PC,
    WXMiniGame,
    TTMiniGame,
    QQMiniGame
}

export class PlatformAdapter extends Singleton {
    private platform: IPlatformSDK = null;
    private static _currentPlatform: EPlatform = EPlatform.PC;
    private static _liuHaiHeight: number = 0;

    constructor() {
        super();
    }

    //初始化
    init(): void {
        console.log("初始SDK");
        ADHelp.getInstance().init();
        if(Laya.Browser.onMiniGame || Laya.Browser.onTTMiniGame || Laya.Browser.onQQMiniGame || Laya.Browser.onQGMiniGame) {
            if(Laya.Browser.onTTMiniGame) {
                Log.l("当前平台为抖音小游戏");
                window['wx'] = window['tt'];
                this.platform = new TTMiniSDK();
                PlatformAdapter._currentPlatform = EPlatform.TTMiniGame;
            } else if(Laya.Browser.onMiniGame) {
                Log.l("当前平台为微信小游戏");
                this.platform = new WXMiniSDK();
                PlatformAdapter._currentPlatform = EPlatform.WXMiniGame;
            } else if(Laya.Browser.onQQMiniGame) {
                Log.l("当前平台为QQ小游戏");
                window['wx'] = window["qq"];
                this.platform = new QQMiniSDK();
                PlatformAdapter._currentPlatform = EPlatform.QQMiniGame;
            } else if(Laya.Browser.onQGMiniGame) {
                Log.l("当前平台为OPPO小游戏");
                this.platform = new QGMiniSDK();
            }
            this.platform.init();


            //开放数据域图集透传
            if(Laya.Browser.onMiniGame) {
                // Laya.loader.load("res/atlas/test.atlas", Laya.Handler.create(this, () => {
                //     Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/test.atlas");
                // }));
            }
            if(Laya.Browser.onMiniGame) {
                var sys: _getSystemInfoSyncReturnValue = wx.getSystemInfoSync();
                PlatformAdapter._liuHaiHeight = Laya.stage.height / sys.windowHeight * sys.statusBarHeight + (PlatformAdapter._currentPlatform == EPlatform.TTMiniGame ? 40 : 0);
                Log.l("小游戏刘海高度:" + PlatformAdapter._liuHaiHeight, "PlatformAdapter");

                //分享
                let showShareMenuObject: _showShareMenuObject = {
                    withShareTicket: false,
                    success: null,
                    fail: null,
                    complete: null
                };
                wx.showShareMenu(showShareMenuObject);
                wx["onShareAppMessage"](function (): Object {
                    var myInviteId: String = "myInviteId=" + UserModel.getInstance().userId;
                    return {
                        title: MAppConfig.shareTitle,
                        query: myInviteId,
                        imageUrl: MAppConfig.shareImage,
                        success: function (): void {}
                    }
                });
            }
        }
    }

    //登陆
    async login() {
        if(Laya.Browser.onMiniGame || Laya.Browser.onQQMiniGame || Laya.Browser.onQGMiniGame) {
            // LoginView.showLoginView();
            let openid = await this.platform.loginAsync();
            UserModel.getInstance().initOpenID(openid);
            // LoginView.closeLoginView();
        } else {
            UserModel.getInstance().initUserInfoRand();
        }
    }

    //游戏里登录（抖音需要）
    async loginInGame(callback = null) {
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame) {
            let sdk: TTMiniSDK = this.platform as any;
            sdk.login2((openid) => {
                if(openid == null || openid == "" || openid == undefined) {
                    if(callback) callback(false);
                    return;
                }
                UserModel.getInstance().initOpenID(openid);
                callback(true);
            });
        }
    }

    //检测是否登录
    checkSession(callback: Function) {
        var obj: any = {};
        obj.success = function (): void {
            callback(true);
        };
        obj.fail = function (): void {
            callback(false);
        };
        wx.checkSession(obj);
    }

    //获取用户信息
    async getUserInfoAsync(callback: Function = null) {
        let res: any = await this.platform.getUserInfoAsync();
        if(res == false) {
            if(callback) callback(false);
            return;
        }

        let name = "";
        let avatarUrl = "";
        if(res.userInfo) {
            name = res.userInfo["nickName"];
            avatarUrl = res.userInfo["avatarUrl"];
        }
        UserModel.getInstance().updateNameAndAcatarurl(name, avatarUrl);
        GameDispatcher.getInstance().event(EventName.USER_GETINFO_OK);

        if(callback) {
            callback(true);
        }
    }

    updateInfiniteModeScore(num) {
        if(Laya.Browser.onMiniGame) {
            wx["getOpenDataContext"]().postMessage({
                type: "InfiniteMode1",
                value: num
            });
        }
    }

    openOpenDataView() {
        if(Laya.Browser.onMiniGame) {
            wx["getOpenDataContext"]().postMessage({
                type: "Open",
                openid: UserModel.getInstance().userId
            });
        }
    }

    //分享
    public shareAppMessage(callback: Function) {
        if(Laya.Browser.onMiniGame || Laya.Browser.onTTMiniGame) {
            this.platform.share((isOk) => {
                if(isOk) {
                    callback(true);
                    console.log("分享成功");
                } else {
                    console.log("分享失败");
                    PlatformAdapter.ShowDialog("提示", "分享失败，无法获取奖励!", () => {
                        PlatformAdapter.getInstance().shareAppMessage(callback);
                    },
                        () => {
                            callback(false);
                            console.log("分享失败3");

                        }, "再次分享", "残忍拒绝", true);
                }
            });
        } else {
            console.log("分享失败2");
            callback(true);
        }
    }

    public static get currentPlatform(): EPlatform {
        return this._currentPlatform;
    }

    //获取刘海高度
    public static getLiuHaiHeight(): number {
        return this._liuHaiHeight;
    }

    //播放震动
    public playVibration(time: number = 1000): void {
        let isOpenShake: boolean = SettingModel.getInstance().isOpenShake;//是否开启震动
        if(!isOpenShake) return;
        if(Laya.Browser.onMiniGame || Laya.Browser.onQQMiniGame) {
            wx.vibrateLong({success: null, fail: null, complete: null});
        } else if(Laya.Browser.onTTMiniGame) {
            wx.vibrateShort({success: null, fail: null, complete: null});
        } else {
            let supportsVibrate = "vibrate" in navigator;//判断设备是否支持该 API
            if(supportsVibrate) {
                window.navigator.vibrate(time);
            }
        }
    }

    //显示对话框
    public static ShowDialog(title: string,
        content: string,
        confirm: Function,
        cancel: Function,
        confirmText: string = "确定",
        cancelText: string = "取消",
        showCancel: boolean = true): void {
        if(Laya.Browser.onMiniGame || Laya.Browser.onTTMiniGame) {
            var obj: any = {
                title: title,
                content: content,
                confirmText: confirmText,
                cancelText: cancelText,
                showCancel: showCancel,
                success(res) {
                    if(res.confirm) {
                        confirm();
                    } else if(res.cancel) {
                        cancel();
                    }
                }
            };
            wx.showModal(obj);
        }
    }

    //激励视频广告
    public showVideoAd(callback: Function, aid: string = "387452") {
        console.log("视频广告");
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame
            || PlatformAdapter.currentPlatform == EPlatform.QQMiniGame) {
            this.platform.showVideoAd(callback);
        } else if(Laya.Browser.onQGMiniGame) {
            ADHelp.getInstance().showVideoAd(callback, aid);
        }else {
            callback(false);
            Message.show("当前平台不支持广告");
        }
    }

    //显示格子广告
    public showGridAd() {
        if(PlatformAdapter.currentPlatform == EPlatform.WXMiniGame) {
            let p: WXMiniSDK = this.platform as any;
            p.showGridAD();
        } else {
            console.log("当前平台不支持广告");
        }
    }

    //隐藏格子广告
    public hideGridAd() {
        if(PlatformAdapter.currentPlatform == EPlatform.WXMiniGame) {
            let p: WXMiniSDK = this.platform as any;
            p.hideGridAD();
        } else {
            console.log("当前平台不支持广告");
        }
    }

    //显示banner广告
    public showBanner() {
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame || PlatformAdapter.currentPlatform == EPlatform.QQMiniGame) {
            let p: WXMiniSDK = this.platform as any;
            p.showBannerAD();
        } else {
            console.log("当前平台不支持广告");
        }
    }

    //隐藏banner广告
    public hideBanner() {
        if( PlatformAdapter.currentPlatform == EPlatform.TTMiniGame || PlatformAdapter.currentPlatform == EPlatform.QQMiniGame) {
            let p: WXMiniSDK = this.platform as any;
            p.hideBannerAD();
        } else {
            console.log("当前平台不支持广告");
        }
    }

    //显示插屏广告
    public showInterstitial() {
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame) {
            this.platform["showInterstitialAd"]();
        } else if(PlatformAdapter.currentPlatform == EPlatform.QQMiniGame) {
            this.platform["showInterstitialAd"]();
        } else {
            console.log("当前平台不支持插屏广告");
        }
    }

    //显示浮层样式
    public showGamePortal() {
        if(false && PlatformAdapter.currentPlatform == EPlatform.WXMiniGame) {
            this.platform["showGamePortal"]();
        } else {
            console.log("当前平台不支持浮层样式广告");
        }
    }

    //开始录制
    public startRecorder(callback) {
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame) {
            let sdk: TTMiniSDK = this.platform as TTMiniSDK;
            sdk.startRecorder(callback);
        } else {
            Log.w("该平台不支持录制", "PlatformAdapter");
        }
    }

    //停止录制
    public stopRecorder(callback) {
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame) {
            let sdk: TTMiniSDK = this.platform as TTMiniSDK;
            sdk.stopRecorder(callback);
        } else {
            Log.w("该平台不支持录制", "PlatformAdapter");
        }
    }

    //分享录屏
    public shareRecorder(callback) {
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame) {
            let sdk: TTMiniSDK = this.platform as TTMiniSDK;
            sdk.shareRecorder(callback);
        } else {
            Log.w("该平台不支持录制", "PlatformAdapter");
        }
    }

    //截屏
    public screenShot(callback) {
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame) {
            let sdk: TTMiniSDK = this.platform as TTMiniSDK;
            sdk.screenShot(callback);
        } else {
            Log.w("该平台不支持截屏", "PlatformAdapter");
        }
    }

    //判断用户是否登录了
    public isLogin() {
        let isLogin;
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame) {
            let sdk: TTMiniSDK = this.platform as TTMiniSDK;
            isLogin = sdk.isLogin();
        } else {
            isLogin = true;
        }
        console.log("获取登录状态", isLogin);
        return isLogin;
    }

    //判断是否已经获取了用户信息
    public isGetUserInfo() {
        let isGetUserInfo;
        if(PlatformAdapter.currentPlatform == EPlatform.TTMiniGame) {
            let sdk: TTMiniSDK = this.platform as TTMiniSDK;
            isGetUserInfo = sdk.isGetUserInfo();
        } else {
            isGetUserInfo = true;
        }
        console.log("获取用户信息状态", isGetUserInfo);
        return isGetUserInfo;
    }

    public canvasToPhotosAlbum(caller: any = null, success: any = null): void {

        if(Laya.Browser.onQGMiniGame){
            let qg:any = Laya.Browser.window.qg;
            if(qg) {
                let c = Laya.Browser.window.__canvas;
                c.toTempFilePath({
                    success: function (res: any) {
                        if(!res) {
                            return;
                        }
                        if(!res.tempFilePath) {
                            return;
                        }
                        if(res.tempFilePath.length < 5) {
                            return;
                        }
    
                        qg.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: function () {
                                if(success) {
                                    success.call(caller);
                                }
                            },
                            fail: function () {
                            }
                        });
                    }
                });
            }
        }else if(Laya.Browser.onTTMiniGame){
            let tt = Laya.Browser.window.tt;

            Laya.Browser.window.canvas.toTempFilePath({
                success: function (res: any) {
                    if(!res) {
                        return;
                    }
                    if(!res.tempFilePath) {
                        return;
                    }
                    if(res.tempFilePath.length < 5) {
                        return;
                    }

                    tt.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function () {
                            if(success) {
                                success.call(caller);
                                console.log("保存成功")
                            }
                        },
                        fail: function () {
                        }
                    });
                }
            });
        }else{
            return;
        }
        
    }

    //创建桌面图标
    public installShortcut(callback:Function = null) {
        if(Laya.Browser.onQGMiniGame) {
            let qg: any = Laya.Browser.window.qg;

            qg.hasShortcutInstalled({
                success: function (res) {
                    // 判断图标未存在时，创建图标
                    if(res == false) {
                        qg.installShortcut({
                            success: function () {
                                // 执行用户创建图标奖励
                                Message.show("桌面图标创建成功");
                                callback(true);
                            },
                            fail: function (err) {
                                callback(false);
                            },
                            complete: function () {}
                        })
                    } else {
                        Message.show("桌面图标已存在");
                        callback(false);
                    }
                },
                fail: function (err) {},
                complete: function () {}
            });
        }

    }
}
