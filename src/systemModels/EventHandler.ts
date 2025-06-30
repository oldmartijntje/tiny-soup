import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {GameEvent} from "../types/custom/SystemTypes.ts";
import {EventSubscriptionInterface} from "../types/dto_interface/EventSubscriptionInterface.ts";
import {EventReceiptInterface} from "../types/dto_interface/EventReceipt.interface.ts";
import {Logger} from "./Logger.ts";

export type EventProtocol = EventProtocolEnum | AdvancedEventProtocolInterface;

const PROTECTION_KEY = "0011101000110011";

interface AdvancedEventProtocolInterface {
    text: string;
    protocol: EventProtocolEnum;
}

function isAdvancedEventProtocolInterface(
    p: EventProtocol
): p is AdvancedEventProtocolInterface {
    return (
        typeof p === 'object' &&
        p !== null &&
        typeof (p as any).text === 'string'
    );
}

class EventHandler {
    private _database: EventSubscriptionInterface[] = [];
    private _nextId: number = 0;
    private _logger: Logger<any>;

    constructor() {
        this._logger = new Logger<EventHandler>(this);
        this._logger.LogInfo("Running EventHandler()")
    }

    public advancedEventProtocol(baseProtocol: EventProtocolEnum, customization: string): AdvancedEventProtocolInterface {
        return {
            protocol: baseProtocol,
            text: customization
        }
    }

    /**
     * Subscribe on an event.
     * @param protocol
     * @param caller
     * @param callback
     */
    public subscribe(protocol: EventProtocol, caller: object, callback: GameEvent): EventReceiptInterface {
        return this.globalSubscribe(protocol, caller, callback, false);
    }

    /**
     * Subscribe on an event, and remove its subscription when it has been emitted once.
     * @param protocol
     * @param caller
     * @param callback
     */
    public subscribeOnce(protocol: EventProtocol, caller: object, callback: GameEvent): EventReceiptInterface {
        return this.globalSubscribe(protocol, caller, callback, true);
    }

    private globalSubscribe(protocol: EventProtocol, caller: object, callback: GameEvent, executeOnce: boolean): EventReceiptInterface {
        let actualProtocol: string = "";
        if (isAdvancedEventProtocolInterface(protocol)) {
            actualProtocol = `${protocol.protocol}://${protocol.text}`;
        } else {
            actualProtocol = `${protocol}://${PROTECTION_KEY}`;
        }
        const receipt: EventReceiptInterface = {
            eventProtocol: actualProtocol,
            executeOnce: executeOnce,
            id: this._nextId
        }
        this._logger.StringifyObject(receipt).PrependText("Subscription Added, receipt: ").Log()
        this._database.push({
            id: this._nextId,
            protocol: actualProtocol,
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
        this._logger.Log(`${caller.constructor.name} unsubscribed from all events.`);
        this._database = this._database.filter(stored => stored.caller !== caller);
    }

    public cancel(id: number) {
        this._logger.Log(`Removed subscription with the ID: ${id}`);
        this._database = this._database.filter(stored => stored.id !== id);
    }

    /**
     * Send an event to all listeners.
     * @param protocol
     * @param error
     * @param value
     */
    emit(protocol: EventProtocol, error: boolean = false, value?: any): void {
        let actualProtocol: string = "";
        if (isAdvancedEventProtocolInterface(protocol)) {
            actualProtocol = `${protocol.protocol}://${protocol.text}`;
        } else {
            actualProtocol = `${protocol}://${PROTECTION_KEY}`;
        }
        this._logger.StringifyObject(value).PrependText(`Emitted event '${actualProtocol}', error == ${error}, with this data: `).Log()
        this._database.forEach(stored => {
            if (stored.protocol === actualProtocol) {
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