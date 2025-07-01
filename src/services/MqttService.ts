// @ts-ignore
import mqtt, { MqttClient } from 'mqtt';
import {config} from "../config.ts";
import {GameService} from "../systemModels/GameService.ts";

// @ts-ignore
const brokerUrl: string = 'wss://' + config.MQTT['brokerUrl+port'];

class MqttService extends GameService {

}

export { MqttService };
