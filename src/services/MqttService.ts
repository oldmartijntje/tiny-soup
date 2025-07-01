// @ts-ignore
import mqtt, {MqttClient, ClientSubscribeCallback, ISubscriptionGrant} from 'mqtt';
import {GameService} from "../systemModels/GameService.ts";
import {SystemLogic} from "../systemModels/SystemLogic.ts";
import {gameConfig} from "../types/dto_interface/GameConfig.interface.ts";
import {events} from "./EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {GameEventDataInterface} from "../types/dto_interface/GameEventData.interface.ts";

// @ts-ignore
const brokerUrl: string = 'wss://' + gameConfig.mqttConfig.brokerUrl + ":" + gameConfig.mqttConfig.brokerPort

export class MqttService extends SystemLogic implements GameService {
    private _client: MqttClient;
    private _subscriptions: { [id: string] : boolean; } = {};
    private _todoSubscriptions: string[] = [];
    private _isRunning: boolean = false;
    constructor() {
        super();
        this._client = mqtt.connect(brokerUrl);
        this._client.on('connect', () => {
            this._isRunning = true;
            this._logger.LogInfo('Connected to MQTT broker');
            this._todoSubscriptions.forEach((el: string) => {
                this.subscribeToTopic(el);
            })
        });
    }

    onInit() {
        events.subscribe(EventProtocolEnum.MQTT_SubscribeToTopic, this, (data: GameEventDataInterface) => {
            if (typeof data.value == typeof "") {
                var topic = data.value as string;
                if (this._subscriptions[topic]) {
                    this._logger.LogWarning(`Failed to subscribe to topic: ${topic}; Subscription already exists.`)
                }
                this._subscriptions[topic] = true;
                if (!this._isRunning) {
                    this._todoSubscriptions.push(topic);
                    return;
                }
                this.subscribeToTopic(topic);
            }
        })

    }

    private subscribeToTopic(topic: string): void {
        const fullTopic = gameConfig.mqttConfig.topicBase + topic;
        this._logger.LogDebug(`Added MQTT subscription for topic: "${topic}"`)
        this._client.subscribe(fullTopic, (err: Error | null, granted: ISubscriptionGrant[] | undefined) => {
            if (err) {
                this._logger.StringifyObject(err).PrependText('Subscribe error: ')
            } else {
                this._logger.StringifyObject(granted).PrependText(`Subscribed to topic: ${fullTopic};`)
            }
        });


    }

}
