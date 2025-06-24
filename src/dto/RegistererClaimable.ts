import {RegistererRegisteredObjectInterface} from "../types/interface/RegistererRegisteredObject.interface.ts";
import {RegistererTypesEnum} from "../types/enum/RegistererTypes.enum.ts";
import {registry} from "../systemModels/Registerer.ts";

export class RegistererClaimable {
    private _id: number;
    constructor(data: RegistererRegisteredObjectInterface) {
        this._id = data.id;
    }

    public get id(): number {
        return this._id;
    }

    ClaimEntry(claimer: object, claimerType: RegistererTypesEnum): object | null {
        return registry.claimRegisteredObject(claimer, claimerType, this);
    }


}