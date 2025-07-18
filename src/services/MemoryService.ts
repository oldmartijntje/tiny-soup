import {SystemLogic} from "../systemModels/SystemLogic.ts";
import {getRandomFiveCharNumber} from "../helpers/RandomisationHelper.ts";

class MemoryService extends SystemLogic {
    private _username: string

    constructor() {
        super()
        const username = localStorage.getItem("tiny-soup:username");
        this._username = username ?? "player" + getRandomFiveCharNumber();
    }

    // Getter for username
    public get username(): string {
        return this._username;
    }

    // Setter for username
    public set username(value: string) {
        this._logger.LogDebug(`Set username value to: "${value}"`)
        localStorage.setItem("tiny-soup:username", value);
        this._username = value;
    }
}

export const memoryService = new MemoryService();


