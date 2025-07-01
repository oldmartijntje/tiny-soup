interface MqttConfigInterface {
    brokerUrl: string;
    brokerPort: number;
    topicBase: string;
}

export interface GameConfigInterface {
    gridSize: number;
    mqttConfig: MqttConfigInterface
}

export const gameConfig: GameConfigInterface = {
    gridSize: 32,
    mqttConfig: {
        brokerUrl: "test.mosquitto.org",
        brokerPort: 8081,
        topicBase: new Date().getUTCFullYear().toString()
    }
}