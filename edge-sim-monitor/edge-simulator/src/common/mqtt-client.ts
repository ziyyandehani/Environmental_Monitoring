import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'mqtt://localhost:1883'; // Replace with your broker URL
const MQTT_OPTIONS = {
    clientId: 'edge-simulator-client',
    clean: true,
    connectTimeout: 4000,
    username: 'your_username', // Optional
    password: 'your_password', // Optional
    reconnectPeriod: 1000,
};

class MQTTClient {
    private client: mqtt.MqttClient;

    constructor() {
        this.client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);
        this.client.on('connect', this.onConnect);
        this.client.on('error', this.onError);
    }

    private onConnect = () => {
        console.log('Connected to MQTT broker');
    };

    private onError = (error: Error) => {
        console.error('MQTT connection error:', error);
    };

    public publish(topic: string, message: string) {
        this.client.publish(topic, message, { qos: 0, retain: false }, (error) => {
            if (error) {
                console.error('Publish error:', error);
            } else {
                console.log(`Message published to ${topic}: ${message}`);
            }
        });
    }

    public subscribe(topic: string, callback: (topic: string, message: string) => void) {
        this.client.subscribe(topic, (error) => {
            if (error) {
                console.error('Subscribe error:', error);
            } else {
                console.log(`Subscribed to ${topic}`);
            }
        });

        this.client.on('message', (topic, message) => {
            callback(topic, message.toString());
        });
    }

    public disconnect() {
        this.client.end();
    }
}

export default MQTTClient;