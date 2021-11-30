export class TweenUtil {
    public static async toAsync(target: any, props: any, duration: number, ease: Function = null, delay: number = 0, coverBefore: boolean = false, autoRecover: boolean = true) {
        return new Promise((resolve, reject) => {
            Laya.Tween.to(target, props, duration, ease, Laya.Handler.create(this, function () {
                resolve();
            }), delay, coverBefore, autoRecover);
        });
    }

    public static async fromAsync(target: any, props: any, duration: number, ease: Function = null, delay: number = 0, coverBefore: boolean = false, autoRecover: boolean = true) {
        return new Promise((resolve, reject) => {
            Laya.Tween.from(target, props, duration, ease, Laya.Handler.create(this, function () {
                resolve();
            }), delay, coverBefore, autoRecover);
        });
    }

    public static async delay(target:any, time:number) {
        return new Promise((resolve, reject) => {
            Laya.timer.once(time, target, ()=> resolve());
        });
    }
}