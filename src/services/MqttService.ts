// @ts-ignore
import mqtt, {MqttClient, ClientSubscribeCallback, ISubscriptionGrant} from 'mqtt';
import {GameService} from "../systemModels/GameService.ts";
import {SystemLogic} from "../systemModels/SystemLogic.ts";
import {gameConfig} from "../types/dto_interface/GameConfig.interface.ts";
import {events} from "./EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {GameEventDataInterface} from "../types/dto_interface/GameEventData.interface.ts";
import {MqttBroadcastInterface} from "../types/dto_interface/MqttBroadcast.interface.ts";

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
        this._client.on('message', (topic: string, message: Buffer) => {
            this.onReceivedMessage(topic, message.toString());
        });
    }

    onInit() {
        // subscribe
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

        // unsubscribe
        events.subscribe(EventProtocolEnum.MQTT_UnSubscribe, this, (data: GameEventDataInterface) => {
            if (typeof data.value == typeof "") {
                var topic = data.value as string;
                if (!this._subscriptions[topic]) {
                    this._logger.LogDebug(`Failed to unsubscribe to topic: ${topic}; Subscription already non-existent.`)
                }
                this._subscriptions[topic] = false;
                this.unsubscribeFromTopic(topic);
            }
        })

        // send message
        events.subscribe(EventProtocolEnum.MQTT_Broadcast, this, (data: GameEventDataInterface) => {
            if (typeof data.value == typeof {}) {
                try {
                    var broadcast = data.value as MqttBroadcastInterface;
                    this.publishMessage(broadcast.topic, broadcast.message);
                } catch (e) {
                    this._logger.StringifyObject(e).PrependText("Failed to parse MQTT message").LogError();
                }
            }
        })
    }

    private subscribeToTopic(topic: string): void {
        const fullTopic = gameConfig.mqttConfig.topicBase + topic;
        this._logger.LogDebug(`Added MQTT subscription for topic: "${fullTopic}"`)
        this._client.subscribe(fullTopic, (err: Error | null, granted: ISubscriptionGrant[] | undefined) => {
            if (err) {
                this._logger.StringifyObject(err).PrependText('Subscribe error: ')
            } else {
                this._logger.StringifyObject(granted).PrependText(`Subscribed to topic: ${fullTopic};`)
            }
        });
    }

    public publishMessage(topic: string, message: string): void {
        const fullTopic = gameConfig.mqttConfig.topicBase + topic;
        this._client.publish(fullTopic, message, {}, (err?: Error) => {
            if (err) console.error('Publish error:', err);
            else console.log(`Message sent to ${fullTopic}: ${message}`);
        });
    }

    private onReceivedMessage(topic: string, message: string): void {
        // Add message handling logic here
        this._logger.LogInfo(`Message received on ${topic}: ${message}`);
    }

    public unsubscribeFromTopic(topic: string): void {
        const fullTopic = gameConfig.mqttConfig.topicBase + topic;
        this._client.unsubscribe(fullTopic, (err?: Error) => {
            if (err) console.error('Unsubscribe error:', err);
            else console.log(`Unsubscribed from topic: ${fullTopic}`);
        });
    }
}
