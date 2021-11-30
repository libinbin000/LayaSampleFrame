export class StringUtil {
    constructor(){

    }

    /* 
	@param str 需要截断的字符串
    @param maxChars 保留的汉字长度
    @param suffix 添加的后缀 （注意，如果后缀不为null或者'' ，则要占用一个汉字的位置 
    */
	public static  stringCut( maxChars:number,str:string, suffix:string="..." ):string{
        if(str == ""){
            return str;
        }
        let toCodePoint:Function = function(unicodeSurrogates):Array<any> {
            let r:Array<any> = [], c:number = 0, p:number = 0, i:number = 0;
            while (i < unicodeSurrogates.length) {
                let pos:number = i;
                c = unicodeSurrogates.charCodeAt(i++);//返回位置的字符的 Unicode 编码 
                if (c == 0xfe0f) {
                    continue;
                }
                if (p) {
                    let value:number = (0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00));
                    r.push({
                        v: value,
                        pos: pos
                    }); //计算4字节的unicode
                   	p = 0;
                } else if (0xD800 <= c && c <= 0xDBFF) {
                    p = c; //如果unicode编码在oxD800-0xDBff之间，则需要与后一个字符放在一起
                } else {
                    	r.push({
                        	v: c,
                        	pos: pos
                    	}); //如果是2字节，直接将码点转为对应的十六进制形式
                	}
            	}
            	return r;
        	}
        	maxChars *= 2;
        	let codeArr:Array<any> = toCodePoint(str);
        	let numChar:number = 0;
        	let index:number = 0;
        	for (let i:number = 0; i < codeArr.length; ++i) {
            	let code:number = codeArr[i].v;
            	let add:number = 1;
            	if (code >= 128) {
                	add = 2;
            	}
            	//如果超过了限制，则按上一个为准
            	if (numChar + add > maxChars){
             	break;
            	}
            	index = i;
            	//累加
            	numChar += add;
        	}
        	if(codeArr.length - 1 == index){
            	return str;
        	}
        	let more:number = suffix? 1:0;
        	return str.substring(0, codeArr[index - more].pos + 1) + suffix;
	}
	
	public static numformat(value:number):string{	
		if(value > 1000000000000000){		
			return (value/1000000000000000).toFixed(1) + "千兆";
		}
        //t
		if(value > 1000000000000){
			return (value/1000000000000).toFixed(1) + "兆";
		}
		//b
		if(value > 100000000){
			return (value/100000000).toFixed(1) + "亿";
		}
		//m
		// if(value > 1000000){
		// 	return (value/1000000).toFixed(1) + "百万";
		// }
		//k
		if(value > 10000){
			return (value/10000).toFixed(1) + "万";
		}
		return value + "";
	}
	
	public static formatGold(num:number):string
	{
		if(num > 1000000000000000000)
		{	
			return Math.floor(num/1000000000000000)+"千兆";
		}
		//t
		if(num > 1000000000000000)
		{
			return Math.floor(num/1000000000000)+"兆";
		}
		//b	
		if(num > 100000000)
		{
			return Math.floor(num/100000000)+"亿";
		}
		//m
		// if(num > 1000000000)
		// {
		// 	return Math.floor(num/1000000)+"百万";
		// }
		//k
		if(num > 10000 )
		{
			return Math.floor(num/10000)+"万";
		}
		return Math.floor(num) + "";
	}

	public static formatGold2 = function(money){
		// let tail = ["", "万", "亿", "兆", "千兆"];
		// let index = 0;
		// let fnum = 0;
		// while(money >= 10000){
		// 	money /= 10000;
		// 	index += 1;
		// }
		// if(money > 100 || index == 0){
		// 	fnum = 0;
		// }else if(money > 10){
		// 	fnum = 1;
		// }else{
		// 	fnum = 2;
		// }
		// let str = Number(money.toFixed(fnum)) + tail[index];
		// return str;
		if(money > 1000000000000000){		
			return (money/1000000000000000).toFixed(1) + "千兆";
		}
        //t
		if(money > 1000000000000){
			return (money/1000000000000).toFixed(1) + "兆";
		}
		//b
		if(money > 100000000){
			return (money/100000000).toFixed(1) + "亿";
		}
		//m
		// if(value > 1000000){
		// 	return (value/1000000).toFixed(1) + "百万";
		// }
		//k
		if(money > 10000){
			return (money/10000).toFixed(1) + "万";
		}
		return money + "";
	}
}