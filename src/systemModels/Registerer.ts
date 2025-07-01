import {Logger} from "./Logger.ts";
import {RegistererRegisteredObjectInterface} from "../types/dto_interface/RegistererRegisteredObject.interface.ts";
import {OnRegistererClaimFunction} from "../types/custom/SystemTypes.ts";
import {RegistererTypesEnum} from "../types/enum/RegistererTypes.enum.ts";
import {RegistererClaimable} from "../dto/RegistererClaimable.ts";

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

    public findAvailable(type: RegistererTypesEnum): RegistererClaimable[] {
        const filtered = this._database.filter(item => item.type == type && (item.singleClaim && item.claimedBy == undefined) || !item.singleClaim);
        const returnList: RegistererClaimable[] = [];
        filtered.forEach((element) => {
            returnList.push(new RegistererClaimable(element));
        })
        return returnList;
    }

    public claimRegisteredObject(claimer: object, claimerType: RegistererTypesEnum, claimable: RegistererClaimable): object | null {
        const claimedItem = this._database.find(item => item.id == claimable.id);
        if (claimedItem == null) {
            return null;
        }
        if (claimedItem.singleClaim && claimedItem.claimedBy) {
            return null;
        }
        if (claimedItem.singleClaim) {
            claimedItem.claimedBy = claimer;
        }
        claimedItem.onUse(claimerType);
        return claimedItem.object;
    }

    /**
     * Remove item from the registry.
     * @param caller
     */
    public die(caller: object): void {
        this._logger.Log(`${caller.constructor.name} unsubscribed from all events.`);
        this._database = this._database.filter(stored => stored.object !== caller);
    }
}

export const registry = new Registerer();