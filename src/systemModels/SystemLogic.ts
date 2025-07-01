import {Logger} from "./Logger.ts";
/**
 * A gamelogic object is meant to be used on every class to make sure it is functional with all standards
 */
export class SystemLogic {
    public _logger: Logger<any>;
    public hasBeenInitiated: boolean;

    constructor() {
        this._logger = new Logger<SystemLogic>(this);
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


}