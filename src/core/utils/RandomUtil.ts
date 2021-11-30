export default class RandomUtil {
    /**
     * 获取一个随机整数
     * @param min 最小值
     * @param max 最大值（不包含）
     */
    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * 获取一个随机浮点数
     * @param min 最大值
     * @param max 最小值 （包含）
     */
    public static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}