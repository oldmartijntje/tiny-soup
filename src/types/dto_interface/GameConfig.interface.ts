interface MqttConfigInterface {
    brokerUrl: string;
    brokerPort: number;
    topicBase: string;
}

export enum ViteRunningMode {
    Production = 0,
    Development = 1
}

export interface StringLengthInterface {
    min: number;
    max: number;
}

export interface GameConfigInterface {
    gridSize: number;
    mqttConfig: MqttConfigInterface,
    usernameLength: StringLengthInterface,
    mode: ViteRunningMode
}

export const gameConfig: GameConfigInterface = {
    gridSize: 32,
    mqttConfig: {
        brokerUrl: "test.mosquitto.org",
        brokerPort: 8081,
        topicBase: new Date().getUTCFullYear().toString() + "protocol."
    },
    usernameLength: {
        min: 4,
        max: 20
    },
    mode: import.meta.env.PROD ? ViteRunningMode.Production : ViteRunningMode.Development
}