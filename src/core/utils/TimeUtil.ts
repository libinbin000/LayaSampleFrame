export class TimeUtil {
	public constructor() {
	}


	//获取时间格式 time秒 00:00:00/
	public static getTime(time: number): string {
		let timeStr: string = "";
		let second: number = time % 60;
		let minute: number = Math.floor(time / 60);
		if (minute >= 60) {
			time = Math.floor(minute / 60);
			timeStr += time > 9 ? time : "0" + time;
			timeStr = timeStr.concat(":");
			minute = minute % 60;
			timeStr += minute > 9 ? minute : "0" + minute;
			timeStr = timeStr.concat(":");
			timeStr += second > 9 ? second : "0" + second;
		} else {
			timeStr = timeStr.concat("00:");
			timeStr += minute > 9 ? minute : "0" + minute;
			timeStr = timeStr.concat(":");
			timeStr += second > 9 ? second : "0" + second;
		}
		return timeStr;
	}


	//获取时间格式 time秒 00:00/
	public static getTime2(time: number): string {
		let timeStr: string = "";
		let second: number = time % 60;
		let minute: number = Math.floor(time / 60);
		timeStr += minute > 9 ? minute : "0" + minute;
		timeStr = timeStr.concat(":");
		timeStr += second > 9 ? second : "0" + second;	
		return timeStr;
	}


	/**毫秒
	 * 将ms时间转换成 天 时：分：秒
	 * @param time:number 输入时间（ms）
	 * @param format:String "DD hh:mm:ss" 格式随意
	 * @return String
	 */
	public static convertTime(time: number, format: string = "DD hh:mm:ss"): string {
		let d: number = Math.floor(time / 86400000);
		let hor: number = Math.floor(time % 86400000 / 3600000);
		let min: number = Math.floor(time % 86400000 % 3600000 / 60000);
		let sec: number = Math.floor(time % 86400000 % 3600000 % 60000 / 1000);
		let DD: string = d + "";
		if (DD == "0") DD = "";
		let hh: string = hor >= 10 ? "" + hor : "0" + hor;
		let mm: string = min >= 10 ? "" + min : "0" + min;
		let ss: string = sec >= 10 ? "" + sec : "0" + sec;
		format = format.replace("DD", DD);
		format = format.replace("hh", hh);
		format = format.replace("mm", mm);
		format = format.replace("ss", ss);
		return format;
    }
    
    //判断俩个时间戳是否是同一天s
	public static isSameDay(timeStamp1: number, timeStamp2: number): boolean {
        let date1:Date = new Date(timeStamp1 * 1000);
        let date2:Date = new Date(timeStamp2 * 1000);
		let y1: number = date1.getFullYear();
		let y2: number = date2.getFullYear();
		let m1: number = date1.getMonth();
		let m2: number = date2.getMonth();
		let d1: number = date1.getDate();
		let d2: number = date2.getDate();
		if (y1 == y2 && m1 == m2 && d1 == d2){
            return true;
        } 
		return false;
	}

}