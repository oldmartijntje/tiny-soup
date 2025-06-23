import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {GameEvent} from "../types/custom/SystemTypes.ts";
import {EventSubscriptionInterface} from "../types/interface/EventSubscriptionInterface.ts";
import {EventReceiptTypeEnum} from "../types/enum/EventReceiptType.enum.ts";
import {EventReceiptInterface} from "../types/interface/EventReceipt.interface.ts";

class EventHandler {
    private _database: EventSubscriptionInterface[] = [];
    private _nextId: number = 0;

    constructor() {

    }


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
     * Subscribe on an event, and remove it's subscription when it has been emitted once.
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
            id: this._nextId,
            receiptType: EventReceiptTypeEnum.SUBSCRIBED
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


}

export const events: EventHandler = new EventHandler();