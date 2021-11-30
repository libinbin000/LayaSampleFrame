import {MAppConfig} from "../AppConfig";
import {Controller} from "../core/mvc/Controller";
import {HttpHelper} from "../core/net/HttpHelper";
import {LayerMgr} from "../core/ui/LayerMgr";
import RandomUtil from "../core/utils/RandomUtil";
import {EventName} from '../event/EventName';
import {GameMgr} from "../logic/GameMgr";
import UserModel from "../model/UserModel";
import {EPlatform, PlatformAdapter} from "../sdk/PlatformAdapter";
import {AExamStep} from "../view/ccheck/CCheckView";
import {GameView} from "../view/game/GameView";

export class CCheckController extends Controller {


    public init(): void {
    }

    public reportData(list:Array<AExamStep>) {

        let req = `uid=${UserModel.getInstance().userId}`
        +`&userinfo=${JSON.stringify(UserModel.getInstance().userdata)}`
        +`&e1=${JSON.stringify(list[1])}`
        +`&e2=${JSON.stringify(list[2])}`
        +`&e3=${JSON.stringify(list[3])}`
        +`&e4=${JSON.stringify(list[4])}`
        +`}`;
        
        console.log("上报数据", req);
        // HttpHelper.postAsync("http://petrun-admin.6899game.com/api/upload", JSON.stringify(req), ["Content-Type", "application/json"]);
        let xhr:Laya.HttpRequest = new Laya.HttpRequest();
        xhr.http.timeout = 10000;//设置超时时间
        xhr.send(MAppConfig.phpRoot + "upload.php", req, "post", "json", ["Content-Type", "application/x-www-form-urlencoded"]);
        xhr.once(Laya.Event.COMPLETE,this,(data)=>{
            // resolve([true, data]);
            console.log(data)
        });

        xhr.once(Laya.Event.ERROR, this, (data)=>{
            // resolve([false, data]);
            console.log(data)
        });
    }
}