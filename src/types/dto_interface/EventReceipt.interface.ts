/**
 * This is the interface that you get back when interacting with the event handler. These are also stored in the EventHandler
 */
export interface EventReceiptInterface {
    id: number;
    eventProtocol: string;
    executeOnce: boolean;
}