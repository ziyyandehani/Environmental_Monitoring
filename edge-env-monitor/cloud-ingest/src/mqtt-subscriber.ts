export class MQTTSubscriber {
    private client: any; // Replace with actual MQTT client type
    private topic: string;

    constructor(brokerUrl: string, topic: string) {
        this.client = this.connect(brokerUrl);
        this.topic = topic;
    }

    connect(brokerUrl: string) {
        const mqtt = require('mqtt'); // Import MQTT library
        const client = mqtt.connect(brokerUrl);

        client.on('connect', () => {
            console.log('Connected to MQTT broker');
            this.subscribe(this.topic);
        });

        client.on('message', (topic: string, message: Buffer) => {
            this.handleMessage(topic, message.toString());
        });

        return client;
    }

    subscribe(topic: string) {
        this.client.subscribe(topic, (err: Error) => {
            if (err) {
                console.error(`Failed to subscribe to topic ${topic}:`, err);
            } else {
                console.log(`Subscribed to topic ${topic}`);
            }
        });
    }

    handleMessage(topic: string, message: string) {
        console.log(`Received message on topic ${topic}:`, message);
        // Process the incoming message
    }
}