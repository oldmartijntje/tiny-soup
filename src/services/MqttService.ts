// @ts-ignore
import mqtt, { MqttClient } from 'mqtt';
import {config} from "../config.ts";

// @ts-ignore
const brokerUrl: string = 'wss://' + config.MQTT['brokerUrl+port'];

class MqttService {

}

export { MqttService };
