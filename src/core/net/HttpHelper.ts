export class HttpHelper{

    static async getAsync(url:string, para:any = null):Promise<[boolean, any]>{
        return new Promise((resolve, reject)=>{
            if(!!para && !url.includes("?")){
                let isFirst = true;
                for(let key in para){
                    if(isFirst){
                        url += `?${key}=${para[key]}`;
                        isFirst = false;
                    }else{
                        url += `&${key}=${para[key]}`;
                    }
                }
            }

            let xhr:Laya.HttpRequest = new Laya.HttpRequest();
            xhr.http.timeout = 10000;//设置超时时间
            xhr.send(url,null,"get");
            xhr.once(Laya.Event.COMPLETE,this,(data)=>{
                resolve([true, data]);
            });

            xhr.once(Laya.Event.ERROR, this, (data)=>{
                resolve([false, data]);
            });
        });
    }

    static async postAsync(url:string, para:any = null, headers:any[] = null):Promise<[boolean, any]>{
        return new Promise((resolve, reject)=>{
            let data = "";
            if(!!para && !url.includes("?")){
                let isFirst = true;
                for(let key in para){
                    if(isFirst){
                        data += `${key}=${para[key]}`;
                        isFirst = false;
                    }else{
                        data += `&${key}=${para[key]}`;
                    }
                }
            }

            console.log(data);
            let xhr:Laya.HttpRequest = new Laya.HttpRequest();
            xhr.http.timeout = 10000;//设置超时时间
            xhr.send(url, data, "post", "json", headers);
            xhr.once(Laya.Event.COMPLETE,this,(data)=>{
                resolve([true, data]);
            });

            xhr.once(Laya.Event.ERROR, this, (data)=>{
                resolve([false, data]);
            });
        });
    }
}