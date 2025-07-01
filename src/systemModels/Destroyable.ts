import {events} from "../services/EventService.ts";

export class Destroyable {
    /**
     * Destroy it.
     */
    public destroy() {
        events.unsubscribe(this);
    }
}