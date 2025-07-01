import {DrawFunction, UpdateFunction} from "../types/custom/SystemTypes.ts";
import {SystemLogic} from "./SystemLogic.ts";

/**
 * GameLoop is the object that handles the whole rendering logic.
 *
 * It makes sure your FPS is stable etc.
 */
export class GameLoop extends SystemLogic {
    private lastFrameTime: number;
    private accumulatedTime: number;
    private timeStep: number;
    private update: UpdateFunction;
    private render: DrawFunction;
    private isRunning: boolean;
    private rafId: number | null;
    constructor(update: UpdateFunction, render: DrawFunction) {
        super();
        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        this.timeStep = 1000 / 60; // 60 fps

        this.update = update;
        this.render = render;

        this.rafId = null;
        this.isRunning = false;
    }

    /**
     * The core game loop function, executed on each animation frame via `requestAnimationFrame`.
     *
     * @param {number} timestamp - The current time (in milliseconds) provided by `requestAnimationFrame`.
     *
     * This method:
     * - Calculates the time elapsed (`deltaTime`) since the last frame.
     * - Accumulates time to support fixed-timestep updates.
     * - Runs one or more `update()` calls if enough time has accumulated.
     * - Calls the `render()` method to draw the current state.
     * - Schedules the next frame by calling `requestAnimationFrame` again.
     *
     * If `isRunning` is false, the loop stops and no further frames are requested.
     */
    private mainLoop = (timestamp: number) => {
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

    /**
     * Start the game loop.
     */
    public start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.rafId = requestAnimationFrame(this.mainLoop);
    }

    /**
     * Stop the game loop
     */
    public stop() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.isRunning = false;
    }
}