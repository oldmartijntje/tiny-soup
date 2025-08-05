import {IHostConnector} from "../../types/interface/IHostConnector.ts";
import {SystemLogic} from "../SystemLogic.ts";

export class HostHostConnector extends SystemLogic implements IHostConnector {
    constructor() {
        super()
    }

    setServer(hostId: string): void {
        throw new Error("Method not implemented.");
    }

    pingTheServer(): void {

    }
}