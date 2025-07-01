// @ts-ignore
import mqtt, { MqttClient } from 'mqtt';
import {config} from "../config.ts";
import {GameService} from "../systemModels/GameService.ts";
import {GameLogic} from "../systemModels/GameLogic.ts";

// @ts-ignore
const brokerUrl: string = 'wss://' + config.MQTT['brokerUrl+port'];

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
