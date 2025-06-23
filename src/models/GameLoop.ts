import {DrawFunction, UpdateFunction} from "../patterns/SystemTypes.ts";

export class GameLoop {
    private lastFrameTime: number;
    private accumulatedTime: number;
    private timeStep: number;
    private update: UpdateFunction;
    private render: DrawFunction;
    private isRunning: boolean;
    private rafId: number | null;
    constructor(update: UpdateFunction, render: DrawFunction) {

        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        this.timeStep = 1000 / 60; // 60 fps

        this.update = update;
        this.render = render;

        this.rafId = null;
        this.isRunning = false;
    }

    mainLoop = (timestamp: number) => {
        if (!this.isRunning) {
            return;
        }

        let deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // Accumulate all the time that has passed
        this.accumulatedTime += deltaTime;

        // fixed time step updates
        // if there is enough accumulated time to run one or more updates
        while (this.accumulatedTime >= this.timeStep) {
            this.update(this.timeStep);
            this.accumulatedTime -= this.timeStep;
        }

        // Render

        this.render();

        this.rafId = requestAnimationFrame(this.mainLoop);
    }

    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.rafId = requestAnimationFrame(this.mainLoop);
    }

    stop() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.isRunning = false;
    }
}