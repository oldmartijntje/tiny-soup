import {GameEventDataInterface} from "../interface/GameEventData.interface.ts";

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