interface MqttConfigInterface {
    brokerUrl: string;
    brokerPort: number;
    topicBase: string;
}

interface StringLengthInterface {
    min: number;
    max: number;
}

export interface GameConfigInterface {
    gridSize: number;
    mqttConfig: MqttConfigInterface,
    usernameLength: StringLengthInterface
}

export const gameConfig: GameConfigInterface = {
    gridSize: 32,
    mqttConfig: {
        brokerUrl: "test.mosquitto.org",
        brokerPort: 8081,
        topicBase: new Date().getUTCFullYear().toString()
    },
    usernameLength: {
        min: 4,
        max: 20
    }
}