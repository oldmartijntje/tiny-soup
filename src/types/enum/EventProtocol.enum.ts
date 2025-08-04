/**
 * All possible events to subscribe to.
 */
export enum EventProtocolEnum {
    TEST= 0,
    ShowMobileOverlay = 1,
    SelectedGamemode = 2,
    ShowHomeMenu = 3,
    SelectMultiplayerModus = 4,
    MQTT_SubscribeToTopic= 5,
    MQTT_UnSubscribe= 6,
    MQTT_MESSAGE_RECEIVED = 7,
    MQTT_Broadcast = 8,
    SetUsernameValue = 9,
    HostLobby = 10,
    JoinLobby = 11,
    DisconnectLobby = 12,
    CloseLobby = 13,
    RefreshHtmlUI = 14
}