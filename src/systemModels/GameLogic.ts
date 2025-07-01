import {Logger} from "./Logger.ts";
import {events} from "./EventHandler.ts";

/**
 * A gamelogic object is meant to be used on every class to make sure it is functional with all standards
 */
export class GameLogic {
    public _logger: Logger<any>;
    public hasBeenInitiated: boolean;

    constructor() {
        this._logger = new Logger<GameLogic>(this);
        this.hasBeenInitiated = false;

        queueMicrotask(() => {
            this.onInit();
            this.hasBeenInitiated = true;
        });
    }

    /**
     * This should implement things like subscriptions etc.
     *
     * Gets run right after the constructor is completed.
     */
    onInit(): void {
        this._logger.LogInfo("Running onInit()");
    }

    /**
     * Destroy it.
     */
    public destroy() {
        events.unsubscribe(this);
    }
}