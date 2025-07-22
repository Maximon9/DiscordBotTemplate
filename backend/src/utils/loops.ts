import {setInterval} from "timers/promises";

export class DBUpdater {
    debug: boolean;
    debugUpdateRate: number;
    #abort = true;
    public get aborted(): boolean {
        return this.#abort;
    }
    #updateFunc: (...args: any[]) => any;
    #abortUpdateFunc: (...args: any[]) => any;
    constructor(
        updateFunc: (...args: any[]) => any,
        abortUpdateFunc: (...args: any[]) => any,
        debug = false,
        debugUpdateRate: number = 1000
    ) {
        this.#updateFunc = updateFunc;
        this.#abortUpdateFunc = abortUpdateFunc;
        this.debug = debug;
        this.debugUpdateRate = debugUpdateRate / 1000;
    }
    Abort() {
        this.#abort = true;
    }
    Start() {
        this.#abort = false;
        this.#func();
    }

    async #func() {
        let realTimer = 0,
            timer = 0,
            lastTimestamp: number = Date.now();
        for await (const _ of setInterval(0)) {
            const timestamp = Date.now();
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;
            realTimer += deltaTime;
            timer += deltaTime;
            if (timer >= this.debugUpdateRate) if (this.debug) console.log(`updating: ${realTimer}`);
            const preTime = Date.now(),
                v1 = await this.#updateFunc();
            if (this.#abort) {
                const v2 = await this.#abortUpdateFunc();
                if (timer >= this.debugUpdateRate) {
                    if (this.debug) {
                        console.log(`updated: ${realTimer + (Date.now() - preTime) / 1000} returnValue: ${v2}`);
                        console.log(`aborted: ${realTimer + (Date.now() - preTime) / 1000}`);
                    }
                }
                break;
            }
            if (timer >= this.debugUpdateRate) {
                if (this.debug) console.log(`updated: ${realTimer + (Date.now() - preTime) / 1000} returnValue: ${v1}`);
                timer -= this.debugUpdateRate;
            }
        }
    }
}

export class TimeoutLoop {
    #timeout = setTimeout(() => {}, 0);
    #aborted = true;
    #loopFunc: (...args: any[]) => any;
    #lastTimestamp = Date.now();
    #timestamp = Date.now();
    #deltaTime = 0;
    #ogTimerUp: () => number;
    #timerUp: number;
    #ogTimerDown: () => number;
    #timerDown: number;

    public get timerUp(): number {
        return this.#timerUp;
    }
    public get timerDown(): number {
        return this.#timerDown;
    }

    get deltaTime(): number {
        return this.#deltaTime;
    }

    constructor(loopFunc: (...args: any[]) => any, timerUp = () => 0, timerDown = () => 0) {
        this.#loopFunc = loopFunc;
        this.#timerUp = timerUp();
        this.#ogTimerUp = timerUp;
        this.#timerDown = timerDown();
        this.#ogTimerDown = timerDown;
    }
    changeLoopFunc(loopFunc: (...args: any[]) => any) {
        this.#loopFunc = loopFunc;
    }

    public get aborted(): boolean {
        return this.#aborted;
    }

    proceed(start = false) {
        if (start) this.#lastTimestamp = Date.now();
        if (this.#aborted) this.#aborted = false;
        this.#timeout = setTimeout(async () => {
            this.#timestamp = Date.now();
            this.#deltaTime = (this.#timestamp - this.#lastTimestamp) / 1000;
            this.#lastTimestamp = this.#timestamp;
            this.#timerUp += this.#deltaTime;
            this.#timerDown -= this.#deltaTime;

            const possiblePromise = this.#loopFunc();
            if (possiblePromise instanceof Promise) await possiblePromise;
        }, 0);
    }

    resetTimers(func?: (...args: any[]) => any) {
        if (func !== undefined) func();
        this.#timerUp = this.#ogTimerUp();
        this.#timerDown = this.#ogTimerDown();
        this.#lastTimestamp = Date.now();
    }

    abort() {
        if (!this.#aborted) {
            clearTimeout(this.#timeout);
            this.#aborted = true;
        }
    }
}
