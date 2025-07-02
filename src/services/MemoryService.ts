import {SystemLogic} from "../systemModels/SystemLogic.ts";
import {getRandomFiveCharNumber} from "../helpers/RandomisationHelper.ts";

export interface LobbySettingsInterface {
    isActive: boolean; // whether this model is actually used.
    lobbyIdentifier: string; // the id you can enter in the join menu.
    discoverable: boolean; // whether you listen to `discoverableLobbyIdentifier` or not
    discoverableLobbyIdentifier: string; // the id that is discoverable
    players: number;
    playing: boolean;
}

export interface LobbyInfoInterface {
    identifier: string;
    lastPing: Date;
    username: string;
    players: number;
}

class MemoryService extends SystemLogic {
    private _username: string;
    private _hostedLobby: LobbySettingsInterface;
    private _joinedLobby: LobbySettingsInterface;
    private _connectionData: ConnectionData;
    private _hostedAndNotJoined: boolean;

    constructor() {
        super()
        const username = localStorage.getItem("tiny-soup:username");
        this._username = username ?? "player" + getRandomFiveCharNumber();
        this._hostedLobby = {
            isActive: false,
            lobbyIdentifier: '',
            discoverable: false,
            discoverableLobbyIdentifier: '',
            players: 1,
            playing: false
        };
        this._joinedLobby = {
            isActive: false,
            lobbyIdentifier: '',
            discoverable: false,
            discoverableLobbyIdentifier: '',
            players: 1,
            playing: false
        };
        this._hostedAndNotJoined = true;
        this._connectionData = new ConnectionData();
    }



    public setLobby(lobby: LobbySettingsInterface): void {
        this._logger.StringifyObject(lobby).PrependText(`Set lobby value to: "`).AppendText('"').LogDebug();
        if (this._hostedAndNotJoined) {
            this._hostedLobby = lobby;
        } else {
            this._joinedLobby = lobby;
        }
    }

    public getLobby(): LobbySettingsInterface {
        return this._hostedAndNotJoined ? this._hostedLobby : this._joinedLobby;
    }

    public setConnData(connData: ConnectionData): void {
        this._logger.StringifyObject(connData).PrependText(`Set connData value to: "`).AppendText('"').LogDebug();
        this._connectionData = connData;
    }

    public getConnData(): ConnectionData {
        return this._connectionData;
    }

    public getDiscovery(): LobbyInfoInterface[] {
        return this._connectionData.getDiscoveryLobbyInfo();
    }

    public get isHostedGame(): boolean {
        return this._hostedAndNotJoined;
    }

    public set isHostedGame(value: boolean) {
        this._logger.LogDebug(`Set isHostedGame value to: "${value}"`)
        this._hostedAndNotJoined = value;
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

class ConnectionData extends SystemLogic {
    private _discovery: LobbyInfoInterface[] = [];
    constructor() {
        super()
    }

    public setDiscoveryLobbyInfo(lobbyInfo: LobbyInfoInterface[]): void {
        this._logger.StringifyObject(lobbyInfo).PrependText(`Set lobbyInfo value to: "`).AppendText('"').LogDebug();
        this._discovery = lobbyInfo;
    }

    public getDiscoveryLobbyInfo(): LobbyInfoInterface[] {
        return this._discovery;
    }
}

export const memoryService = new MemoryService();


