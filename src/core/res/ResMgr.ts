export class ResMgr {
    public static async loadAsync(url: string | string[] |laya.net.loadItem[]) {
        return new Promise((resolve, reject) => {
            Laya.loader.load(url, new Laya.Handler(this, function (): void {
                resolve();
            }));
        })
    }

    public static async createAsync(url: string | string[] |laya.net.loadItem[]) {
        return new Promise((resolve, reject) => {
            Laya.loader.create(url, new Laya.Handler(this, function (): void {
                resolve();
            }));
        })
    }
}