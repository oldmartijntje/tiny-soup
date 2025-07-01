// @ts-ignore
import mqtt, { MqttClient } from 'mqtt';
import {GameService} from "../systemModels/GameService.ts";
import {GameLogic} from "../systemModels/GameLogic.ts";
import {gameConfig} from "../types/dto_interface/GameConfig.interface.ts";

// @ts-ignore
const brokerUrl: string = 'wss://' + gameConfig.mqttConfig.brokerUrl + ":" + gameConfig.mqttConfig.brokerPort

export class MqttService extends GameLogic implements GameService {
    private _client: MqttClient;
    constructor() {
        super();
        this._client = mqtt.connect(brokerUrl);
        this._client.on('connect', () => {
            this._logger.LogInfo('Connected to MQTT broker');
        });
    }

    onInit() {


    }

    subscribe() {

    }
}
