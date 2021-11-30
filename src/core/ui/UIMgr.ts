// import { LoginView } from "../../view/login/LoginView";

// export enum ELayer{
//     /**系统层级 */
//     SCENE = 100,
//     DIALOG = 200,
//     TIP = 1000
// }

// export interface IUIOption{
//     layer?:ELayer;
// }

// export class UIMgr{
//     private static _uiRoot:Laya.Sprite;
//     private static _uiLayerMap:Map<number, Laya.Sprite>;
//     private static _uiMap:Map<string, Laya.Sprite>;

//     public static init(){
//         if(this._uiRoot == null){
//             this._uiRoot = new Laya.Sprite();
//             Laya.stage.addChild(this._uiRoot);
//         }
//         this._uiLayerMap = new Map();
//         this._uiMap = new Map();
//         let a = UIMgr.openUI(LoginView, {});
//     }

//     /**
//      * 打开一个UI
//      * @param clazz UI类
//      * @param option 
//      * @param argc 
//      */
//     public static openUI<T extends Laya.Sprite>(clazz:{new ():T}, option:IUIOption, argc?:any){
//         if(!option.layer){
//             option.layer = ELayer.DIALOG;
//         }

//         let layer = this._uiLayerMap.get(option.layer);
//         if(!layer){
//             layer = new Laya.Sprite();
//             this._uiLayerMap.set(option.layer, layer);
//         }
        
//         let view = this._uiMap.get(clazz.name);
//         if(!view){
//             view = new clazz();
//             this._uiMap.set(clazz.name, view);
//         }
        
//         layer.addChild(view);
//     }

//     public static close(){
        
//     }

//     public static destory(){

//     }
// }