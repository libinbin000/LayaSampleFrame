export class MathUtil {    
    public static radianToDegree(radian:number):number{
        return radian / Math.PI * 180;
    }

    public static degreeToRadian(degree:number):number{
        return degree * Math.PI / 180;
    }

    public static abs(f: number): number {
        return Math.abs(f);
    }

    public static clamp(value: number, min: number, max: number): number {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        return value;
    }

    public static clamp01(value: number): number {
        if (value < 0) {
            return 0;
        }
        if (value > 1) {
            return 1;
        }
        return value;
    }

    public static deltaAngle(current: number, target: number): number {
        let num: number = MathUtil.repeat(target - current, 360);
        if (num > 180) {
            num -= 360;
        }
        return num;
    }

    public static floor(f: number): number {
        return Math.floor(f);
    }

    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * MathUtil.clamp01(t);
    }

    public static lerpAngle(a: number, b: number, t: number): number {
        let num = MathUtil.repeat(b - a, 360);
        if (num > 180) {
            num -= 360;
        }
        return a + num * MathUtil.clamp01(t);
    }

    public static max(a: number, b: number): number {
        return (a <= b) ? b : a;
    }

    public static moveTowards(current: number, target: number, maxDelta: number): number {
        if (MathUtil.abs(target - current) <= maxDelta) {
            return target;
        }
        return current + MathUtil.sign(target - current) * maxDelta;
    }

    public static moveTowardsAngle(current: number, target: number, maxDelta: number): number {
        target = current + MathUtil.deltaAngle(current, target);
        return MathUtil.moveTowards(current, target, maxDelta);
    }

    public static pingPong(t: number, length: number): number {
        t = MathUtil.repeat(t, length * 2);
        return length - MathUtil.abs(t - length);
    }

    public static repeat(t: number, length: number): number {
        return t - MathUtil.floor(t / length) * length;
    }

    public static sign(f: number): number {
        return (f < 0) ? -1 : 1;
    }

    public static smoothDamp(current: number, target: number, currentVelocity: number, smoothTime: number, maxSpeed: number = Number.MAX_VALUE, deltaTime: number = Laya.timer.delta):[number, number] {
        smoothTime = MathUtil.max(0.0001, smoothTime);
        let num = 2 / smoothTime;
        let num2 = num * deltaTime;
        let num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
        let num4 = current - target;
        let num5 = target;
        let num6 = maxSpeed * smoothTime;
        num4 = MathUtil.clamp(num4, -num6, num6);
        target = current - num4;
        let num7 = (currentVelocity + num * num4) * deltaTime;
        currentVelocity = (currentVelocity - num * num7) * num3;
        let num8 = target + (num4 + num7) * num3;
        if (num5 - current > 0 == num8 > num5) {
            num8 = num5;
            currentVelocity = (num8 - num5) / deltaTime;
        }
        return [num8, currentVelocity];
    }

    public static  smoothDampAngle(current: number, target: number, currentVelocity: number, smoothTime: number, maxSpeed: number = Number.MAX_VALUE, deltaTime: number = Laya.timer.delta):[number, number]
    {
        target = current + MathUtil.deltaAngle(current, target);
        return MathUtil.smoothDamp(current, target, currentVelocity, smoothTime, maxSpeed, deltaTime);
    }
}