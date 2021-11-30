export class FontUtil{
    public static registerBitMapFont(url:string,name:string):void{
        FontUtil.loadFont(url,name);
    }

    private static loadFont(url:string,name:string): void {
        var bitmapFont: Laya.BitmapFont = new Laya.BitmapFont();
        bitmapFont.loadFont(url, new Laya.Handler(this, FontUtil.onFontLoaded, [bitmapFont,name]));
    }

    private static onFontLoaded(bitmapFont: Laya.BitmapFont,name:string): void {
       Laya.Text.registerBitmapFont(name, bitmapFont);
    }
}