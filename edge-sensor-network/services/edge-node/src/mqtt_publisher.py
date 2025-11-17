class MQTTPublisher:
    def __init__(self, mqtt_client, topic):
        self.mqtt_client = mqtt_client
        self.topic = topic

    def publish(self, message):
        self.mqtt_client.publish(self.topic, message)

    def on_publish(self, client, userdata, mid):
        print(f"Message {mid} published to {self.topic}")