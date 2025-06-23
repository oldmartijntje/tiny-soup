import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {GameEvent} from "../types/custom/SystemTypes.ts";
import {EventSubscriptionInterface} from "../types/interface/EventSubscriptionInterface.ts";
import {EventReceiptInterface} from "../types/interface/EventReceipt.interface.ts";

class EventHandler {
    private _database: EventSubscriptionInterface[] = [];
    private _nextId: number = 0;

    /**
     * Subscribe on an event.
     * @param protocol
     * @param caller
     * @param callback
     */
    public subscribe(protocol: EventProtocolEnum, caller: object, callback: GameEvent): EventReceiptInterface {
        return this.globalSubscribe(protocol, caller, callback, false);
    }

    /**
     * Subscribe on an event, and remove its subscription when it has been emitted once.
     * @param protocol
     * @param caller
     * @param callback
     */
    public subscribeOnce(protocol: EventProtocolEnum, caller: object, callback: GameEvent): EventReceiptInterface {
        return this.globalSubscribe(protocol, caller, callback, true);
    }

    private globalSubscribe(protocol: EventProtocolEnum, caller: object, callback: GameEvent, executeOnce: boolean): EventReceiptInterface {
        var receipt: EventReceiptInterface = {
            eventProtocol: protocol,
            executeOnce: executeOnce,
            id: this._nextId
        }
        this._database.push({
            id: this._nextId,
            protocol: protocol,
            caller: caller,
            callback: callback,
            executeOnce: executeOnce
        });
        this._nextId++;
        return receipt;
    }

    /**
     * Remove all subscriptions from this object.
     * @param caller
     */
    public unsubscribe(caller: object): void {
        this._database = this._database.filter(stored => stored.caller !== caller);
    }

    public cancel(id: number) {
        this._database = this._database.filter(stored => stored.id !== id);
    }

    /**
     * Send an event to all listeners.
     * @param protocol
     * @param error
     * @param value
     */
    emit(protocol: EventProtocolEnum, error: boolean, value?: any): void {
        this._database.forEach(stored => {
            if (stored.protocol === protocol) {
                stored.callback({
                    error: error,
                    data: value
                });
                if (stored.executeOnce) {
                    this.cancel(stored.id);
                }
            }
        })
    }

}

export const events: EventHandler = new EventHandler();