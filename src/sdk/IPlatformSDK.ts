export interface IPlatformSDK{
    init():Promise<void>;
    loginAsync():Promise<any>;
    getUserInfoAsync():Promise<_getUserInfoSuccessObject>;
    shareAsync():Promise<boolean>;
    share(callback:Function):void;
    showVideoAd(callback:Function):void;
}