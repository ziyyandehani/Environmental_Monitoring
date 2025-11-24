import { connect, Client, IClientOptions, ISubscriptionOptions } from 'mqtt';
import { MQTT_TOPICS } from './topics';

export class MQTTClient {
    private client: Client;

    constructor(private brokerUrl: string) {
        const options: IClientOptions = {
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
        };
        this.client = connect(this.brokerUrl, options);
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to MQTT broker');
                resolve();
            });

            this.client.on('error', (err) => {
                console.error('Connection error:', err);
                reject(err);
            });
        });
    }

    publish(data: any, topic: string = MQTT_TOPICS.SENSOR_DATA): void {
        this.client.publish(topic, JSON.stringify(data), { qos: 1 }, (err) => {
            if (err) {
                console.error('Publish error:', err);
            } else {
                console.log('Data published to topic:', topic);
            }
        });
    }
}