import {SystemLogic} from "./SystemLogic.ts";
import {Destroyable} from "./Destroyable.ts";
import {events} from "../services/EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {memoryService} from "../services/MemoryService.ts";
import {MqttBroadcastInterface} from "../types/dto_interface/MqttBroadcast.interface.ts";
import {MqttTopics} from "../types/custom/MqttTopics.ts";
import {MQTT_LobbyAnnouncementInterface} from "../types/dto_interface/MqttMessages.ts";

function isMqttLobbyAnnouncementInterface(obj: any): obj is MQTT_LobbyAnnouncementInterface {
    return typeof obj === 'object' &&
        obj !== null &&
        typeof obj.identifier === 'string';
}

function parseMqttLobbyAnnouncement(jsonString: string): MQTT_LobbyAnnouncementInterface | undefined {
    try {
        const parsed = JSON.parse(jsonString);
        if (isMqttLobbyAnnouncementInterface(parsed)) {
            return parsed;
        }
    } catch (e) {
        // Optionally log error
    }
    return undefined;
}



export class LobbySystem extends SystemLogic implements Destroyable {

    constructor() {
        super();
    }

    onInit() {
        events.subscribe(EventProtocolEnum.HostLobby, this, ()=> {
            // @ts-ignore
            const lobby = memoryService.getDiscovery();

        });

        events.subscribe(EventProtocolEnum.MQTT_MESSAGE_RECEIVED, this, (data)=> {
            if (typeof data.value == typeof {}) {
                try {
                    var broadcast = data.value as MqttBroadcastInterface;
                    if (broadcast.topic == MqttTopics.LOBBY_DISCOVERY) {
                        const message = parseMqttLobbyAnnouncement(broadcast.message);
                        if (message == undefined) {
                            return;
                        }

                        const discovery = memoryService.getDiscovery();
                        const thisLobby = discovery.find(value => value.identifier == message.identifier);
                        if (thisLobby == null) {
                            discovery.push({
                                identifier: message.identifier,
                                lastPing: new Date()
                            })
                        } else {
                            thisLobby.lastPing = new Date();
                        }
                    }
                } catch (e) {
                    this._logger.StringifyObject(e).PrependText("Failed to parse MQTT message").LogError();
                }
            }
        });
    }


    /**
     * Destroy it.
     */
    public destroy() {
        events.unsubscribe(this);
    }
}