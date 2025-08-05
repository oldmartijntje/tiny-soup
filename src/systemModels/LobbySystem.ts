import {SystemLogic} from "./SystemLogic.ts";
import {Destroyable} from "./Destroyable.ts";
import {events} from "../services/EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {LobbyInfoInterface, LobbySettingsInterface, memoryService} from "../services/MemoryService.ts";
import {MqttBroadcastInterface} from "../types/dto_interface/MqttBroadcast.interface.ts";
import {MqttTopics} from "../types/custom/MqttTopics.ts";
import {MQTT_LobbyAnnouncementInterface, MQTT_LobbyClosingInterface} from "../types/dto_interface/MqttMessages.ts";
import {gameConfig} from "../types/dto_interface/GameConfig.interface.ts";
import {GameEventDataInterface} from "../types/dto_interface/GameEventData.interface.ts";

function isMqttLobbyAnnouncementInterface(obj: any): obj is MQTT_LobbyAnnouncementInterface {
    return typeof obj === 'object' &&
        obj !== null &&
        typeof obj.identifier === 'string';
}

function isMqttLobbyClosingInterface(obj: any): obj is MQTT_LobbyClosingInterface {
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

function parseMqttLobbyCloseAnnouncement(jsonString: string): MQTT_LobbyClosingInterface | undefined {
    try {
        const parsed = JSON.parse(jsonString);
        if (isMqttLobbyClosingInterface(parsed)) {
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
                    var broadcast: MqttBroadcastInterface = data.value as MqttBroadcastInterface;
                    if (broadcast.topic == MqttTopics.LOBBY_DISCOVERY) {
                        const message: MQTT_LobbyAnnouncementInterface | undefined = parseMqttLobbyAnnouncement(broadcast.message);
                        if (message == undefined) {
                            return;
                        }
                        if (message.identifier == memoryService.getLobby().discoverableLobbyIdentifier) {
                            return;
                        }

                        const discovery: LobbyInfoInterface[] = memoryService.getDiscovery();
                        const thisLobby: LobbyInfoInterface | undefined = discovery.find(value => value.identifier == message.identifier);
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
                        events.emit(EventProtocolEnum.RefreshHtmlUI);
                    } else if (broadcast.topic == MqttTopics.LOBBY_CLOSED) {
                        const message: MQTT_LobbyClosingInterface | undefined = parseMqttLobbyCloseAnnouncement(broadcast.message);
                        let identifier: string | undefined = message?.identifier;
                        if (!identifier) return;
                        if (message?.isClosingBecauseOfStart == true && message?.identifier == memoryService.getLobby().discoverableLobbyIdentifier) {
                            // TODO: create logic to ignore the closing when you are connected and the game is starting.
                        }
                        let discovery: LobbyInfoInterface[] = memoryService.getDiscovery();
                        discovery = discovery.filter((el: LobbyInfoInterface): boolean => {
                            return el.identifier != identifier;
                        })
                        memoryService.getConnData().setDiscoveryLobbyInfo(discovery);
                        events.emit(EventProtocolEnum.RefreshHtmlUI);
                    }
                } catch (e) {
                    this._logger.StringifyObject(e).PrependText("Failed to parse MQTT message").LogError();
                }
            }
        });

        events.subscribe(EventProtocolEnum.CloseLobby, this, (data: GameEventDataInterface) => {
            if (typeof data.value == typeof {}) {
                const mqttMessage: MQTT_LobbyClosingInterface = {
                    identifier: data.value.discoverableLobbyIdentifier,
                    isClosingBecauseOfStart: false
                }
                const message: MqttBroadcastInterface = {
                    topic: MqttTopics.LOBBY_CLOSED,
                    message: JSON.stringify(mqttMessage),
                }
                events.emit(EventProtocolEnum.MQTT_Broadcast, false, message)
            }
        })

        setInterval(() => {
            this.sendLobbyPing();
        }, 5000)

        setInterval(() => {
            this.cleanupTask();
        }, 1000 * 30)
    }

    private sendLobbyPing(): void {
        const lobby: LobbySettingsInterface = memoryService.getLobby();
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

    private cleanupTask(): void {
        this._logger.LogInfo("Running cleanupTask()")
        let discovery: LobbyInfoInterface[] = memoryService.getDiscovery();
        const minuteAgo = Date.now() - 1000 * 60 * 2; // 2 minutes ago
        discovery = discovery.filter((el: LobbyInfoInterface): boolean => {
            return el.lastPing.getTime() > minuteAgo;
        })
        memoryService.getConnData().setDiscoveryLobbyInfo(discovery);
        events.emit(EventProtocolEnum.RefreshHtmlUI);
    }


    /**
     * Destroy it.
     */
    public destroy(): void {
        events.unsubscribe(this);
    }
}