import { MQTTSubscriber } from './mqtt-subscriber';

const subscriber = new MQTTSubscriber();

const start = async () => {
    await subscriber.connect();
    subscriber.subscribe('sensor/data');
};

start().catch(console.error);