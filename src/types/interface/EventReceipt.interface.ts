import {EventReceiptTypeEnum} from "../enum/EventReceiptType.enum.ts";
import {EventProtocolEnum} from "../enum/EventProtocol.enum.ts";

/**
 * This is the interface that you get back when interacting with the event handler. These are also stored in the EventHandler
 */
export interface EventReceiptInterface {
    receiptType: EventReceiptTypeEnum;
    id: number;
    eventProtocol: EventProtocolEnum;
    executeOnce: boolean;
}