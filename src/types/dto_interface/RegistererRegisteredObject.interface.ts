import {RegistererTypesEnum} from "../enum/RegistererTypes.enum.ts";
import {OnRegistererClaimFunction} from "../custom/SystemTypes.ts";

/**
 * This interface is used inside of the registerer to remember all registries and handle them accordingly.
 */
export interface RegistererRegisteredObjectInterface {
    id: number;
    object: object;
    singleClaim: boolean;
    type: RegistererTypesEnum;
    claimedBy?: object;
    onUse: OnRegistererClaimFunction
}