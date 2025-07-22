import { EventEmitter } from "./eventEmitter";
export const appEventEmitter = new EventEmitter();

//#region Main
export default class App {
    static #updateOnceAfterPause: boolean = false;
    static #updateOnceAfterPauseCount: number = 0;
    static #fps: number = 0;

    static get fps(): number {
        return this.#fps;
    }

    static #deltaTime: number = 0;
    static get deltaTime(): number {
        return this.#deltaTime;
    }
    static #timer: number = 0;
    static get timer(): number {
        return Math.round(App.#timer);
    }

    static #actualTimeScale = 1;
    static get timeScale(): number {
        return App.#actualTimeScale;
    }
    static set timeScale(value: number) {
        App.#actualTimeScale = value;
    }
    static #lastTimestamp: number = 0;
    static #times: number[] = [];
    static #hasStarted = false;
    static get hasStarted(): boolean {
        return this.#hasStarted;
    }

    static actualstart(): void {
        if (App.#hasStarted) return;
        appEventEmitter.emit("start");
        App.#update = setInterval(this.actualUpdate, 0);
        App.#hasStarted = true;
    }

    static endApp(): void {
        clearInterval(this.#update);
    }

    static #update: NodeJS.Timeout;

    private static actualUpdate(): void {
        const timestamp = Date.now();
        App.#deltaTime =
            ((timestamp - App.#lastTimestamp) / 1000) * App.timeScale;
        App.#lastTimestamp = timestamp;

        while (App.#times.length > 0 && App.#times[0] <= timestamp - 1000) {
            App.#times.shift();
        }
        App.#times.push(timestamp);

        App.#timer += App.#deltaTime;
        App.#fps = App.#times.length;

        if (App.#updateOnceAfterPause) {
            if (App.timeScale != 0) {
                appEventEmitter.emit("update");
                if (App.#updateOnceAfterPauseCount > 0)
                    App.#updateOnceAfterPauseCount = 0;
            } else {
                if (App.#updateOnceAfterPauseCount < 1) {
                    appEventEmitter.emit("update");
                    App.#updateOnceAfterPauseCount++;
                }
            }
        } else {
            if (App.timeScale != 0) {
                appEventEmitter.emit("update");
                if (App.#updateOnceAfterPauseCount > 0)
                    App.#updateOnceAfterPauseCount = 0;
            }
        }
    }
}
//#endregion Main
