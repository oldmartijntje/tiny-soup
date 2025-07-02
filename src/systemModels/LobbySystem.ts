import {SystemLogic} from "./SystemLogic.ts";
import {Destroyable} from "./Destroyable.ts";
import {events} from "../services/EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {memoryService} from "../services/MemoryService.ts";
import {MqttBroadcastInterface} from "../types/dto_interface/MqttBroadcast.interface.ts";
import {MqttTopics} from "../types/custom/MqttTopics.ts";
import {MQTT_LobbyAnnouncementInterface} from "../types/dto_interface/MqttMessages.ts";
import {gameConfig} from "../types/dto_interface/GameConfig.interface.ts";

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
            this.sendLobbyPing();
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
                        if (message.identifier == memoryService.getLobby().discoverableLobbyIdentifier) {
                            return;
                        }

                        const discovery = memoryService.getDiscovery();
                        const thisLobby = discovery.find(value => value.identifier == message.identifier);
                        if (thisLobby == null) {
                            discovery.push({
                                identifier: message.identifier,
                                lastPing: new Date(),
                                username: message.username,
                                players: message.players
                            });
                        } else {
                            thisLobby.lastPing = new Date();
                            thisLobby.players = message.players;
                        }
                    }
                } catch (e) {
                    this._logger.StringifyObject(e).PrependText("Failed to parse MQTT message").LogError();
                }
            }
        });
        setInterval(() => {
            this.sendLobbyPing();
        }, 5000)
    }

    private sendLobbyPing() {
        const lobby = memoryService.getLobby();
        if (!lobby.discoverable || !lobby.isActive || lobby.players >= gameConfig.playersPerGame.max ||
            lobby.playing || !memoryService.isHostedGame) return;
        const mqttMessage: MQTT_LobbyAnnouncementInterface = {
            identifier: lobby.discoverableLobbyIdentifier,
            username: memoryService.username,
            players: 1
        }
        const message: MqttBroadcastInterface = {
            topic: MqttTopics.LOBBY_DISCOVERY,
            message: JSON.stringify(mqttMessage),
        }
        events.emit(EventProtocolEnum.MQTT_Broadcast, false, message)

    }


    /**
     * Destroy it.
     */
    public destroy() {
        events.unsubscribe(this);
    }
}