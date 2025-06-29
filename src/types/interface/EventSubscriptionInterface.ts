import {GameEvent} from "../custom/SystemTypes.ts";
/**
 * How an event subscription is stored in the eventhandler.
 */
export interface EventSubscriptionInterface {
    id: number;
    callback: GameEvent;
    executeOnce: boolean;
    protocol: string;
    caller: object;
}