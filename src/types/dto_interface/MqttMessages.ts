export interface MQTT_LobbyAnnouncementInterface {
    identifier: string;
    username: string;
    players: number;
}

export interface MQTT_LobbyClosingInterface {
    identifier: string;
    isClosingBecauseOfStart: boolean;
}