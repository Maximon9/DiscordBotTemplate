export class Mathf {
    static get PI() {
        return Math.PI;
    }
    static Clamp01(num: number) {
        this.Clamp(num, 0, 1);
    }
    static Clamp(num: number, min: number, max: number) {
        if (num > max) {
            return max;
        }
        else if (num < min) {
            return min;
        }
        else {
            return num;
        }
    }
}
