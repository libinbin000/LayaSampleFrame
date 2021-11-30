
import {MAppConfig} from './AppConfig';
import {ConfigManager} from './core/config/ConfigManager';
import {Log} from './core/log/Log';
import {GameDispatcher} from './event/EventDispatcher';
import {EventName} from './event/EventName';
import GameConfig from "./GameConfig";
import {EPlatform, PlatformAdapter} from './sdk/PlatformAdapter';
import {FontUtil} from './core/utils/FontUtil';
import {ResMgr} from './core/res/ResMgr';
import {ShaderUtil} from './core/utils/ShaderUtil';
import {ui} from './ui/layaMaxUI';

class Main {
    constructor() {
        var _config: Config3D = new Config3D();
        //设置不开启抗锯齿
        _config.isAntialias = false;
        //根据IDE设置初始化引擎		
        if(window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height, _config);
        else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig.scaleMode;
        Laya.stage.screenMode = GameConfig.screenMode;
        Laya.stage.alignV = GameConfig.alignV;
        Laya.stage.alignH = GameConfig.alignH;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if(GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
        if(GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
        if(GameConfig.stat) Laya.Stat.show();
        Laya.alertGlobalError(true);
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }

    enableDebug() {
        if(!Laya.Browser.onQGMiniGame) {return;}

        qg.setEnableDebug({
            enableDebug: true, // true 为打开，false 为关闭
            success: function () {
                // 以下语句将会在 vConsole 面板输出 
            },
            complete: function () {
            },
            fail: function () {
            }
        });
    }

    onVersionLoaded(){
        let s =  new ui.scene.DemoUI();
        s.open();
    }
}
//激活启动类
new Main();
