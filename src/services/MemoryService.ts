import {SystemLogic} from "../systemModels/SystemLogic.ts";
import {getRandomFiveCharNumber} from "../helpers/RandomisationHelper.ts";

export interface LobbySettings {
    isActive: boolean;
    lobbyIdentifier: string;
    discoverable: boolean;
    discoverableLobbyIdentifier: string;
}

class MemoryService extends SystemLogic {
    private _username: string
    private _lobby: LobbySettings

    constructor() {
        super()
        const username = localStorage.getItem("tiny-soup:username");
        this._username = username ?? "player" + getRandomFiveCharNumber();
        this._lobby = {
            isActive: false,
            lobbyIdentifier: '',
            discoverable: false,
            discoverableLobbyIdentifier: ''
        };
    }

    public setLobby(lobby: LobbySettings): void {
        this._logger.StringifyObject(lobby).PrependText(`Set lobby value to: "`).AppendText('"').LogDebug();
        this._lobby = lobby;
    }

    public getLobby(): LobbySettings {
        return this._lobby;
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


