import {GameEventDataInterface} from "../dto_interface/GameEventData.interface.ts";
import {RegistererTypesEnum} from "../enum/RegistererTypes.enum.ts";

/**
 * A method that calls every game tick.
 */
export type UpdateFunction = (deltaTime: number) => void;

/**
 * A method that calls every frame.
 */
export type DrawFunction = () => void;

/**
 * The callback for an event.
 */
export type GameEvent = (data: GameEventDataInterface) => void

/**
 * This is the method that is called whenever an object is claimed / requested by another object.
 */
export type OnRegistererClaimFunction = (claimedBy: RegistererTypesEnum) => void