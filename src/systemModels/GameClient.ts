import {SystemLogic} from "./SystemLogic.ts";
import {events} from "../services/EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {IHostConnector} from "../types/interface/IHostConnector.ts";
import {ClientHostConnector} from "./hostConnector/ClientHostConnector.ts";
import {HostHostConnector} from "./hostConnector/hostHostConnector.ts";
import {GameEventDataInterface} from "../types/dto_interface/GameEventData.interface.ts";

export class GameClient extends SystemLogic {
    public gameRunning: boolean = false;
    private _isHost: boolean = false;
    private _isConnectedToHost: boolean = false;
    private _hostConnector: IHostConnector = new ClientHostConnector();
    constructor() {
        super()
    }

    onInit() {
        events.subscribe(EventProtocolEnum.HostLobby, this, ()=> {
            this._isHost = true;
            this._isConnectedToHost = true;
            this._hostConnector = new HostHostConnector();
        });
        events.subscribe(EventProtocolEnum.OpenDiscoveryScreen, this, ()=> {
            this._isHost = false;
            this._isConnectedToHost = false;
            this._hostConnector = new ClientHostConnector();
        });

        events.subscribe(EventProtocolEnum.JoinLobby, this, (data: GameEventDataInterface)=> {
            let id: string | undefined = data.value as string | undefined;
            if (!id) return;
            this._hostConnector.setServer(id);
            this._isHost = false;
            this._isConnectedToHost = true;
        });

        setInterval(() => {
            this.healthDiagnostic();
        }, 5000)
    }

    healthDiagnostic() {
        if (this._isConnectedToHost) {
            this._hostConnector.pingTheServer();
        }
    }

    die() {
        this.gameRunning = false;
        this._isConnectedToHost = false;
    }
}