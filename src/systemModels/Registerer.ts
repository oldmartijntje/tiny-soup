import {Logger} from "./Logger.ts";
import {RegistererRegisteredObjectInterface} from "../types/interface/RegistererRegisteredObject.interface.ts";
import {OnRegistererClaimFunction} from "../types/custom/SystemTypes.ts";
import {RegistererTypesEnum} from "../types/enum/RegistererTypes.enum.ts";

class Registerer {
    private _nextId: number = 0;
    private _logger: Logger<any>;
    private _database: RegistererRegisteredObjectInterface[] = [];

    constructor() {
        this._logger = new Logger<Registerer>(this);
        this._logger.LogInfo("Running Registerer()")
    }

    public registerMe(user: object, type: RegistererTypesEnum, singleUse: boolean, onUse?: OnRegistererClaimFunction) {
        this._database.push({
            id: this._nextId,
            object: user,
            singleClaim: singleUse,
            type: type,
            onUse: onUse ?? ((claimedBy: RegistererTypesEnum) => {
                console.log(`Default handler: ${type} was claimed by: ${claimedBy}`);
            }),

        })
        this._nextId++;
    }


}

export const registry = new Registerer();