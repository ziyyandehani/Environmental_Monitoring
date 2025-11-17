class MQTTSubscriber:
    def __init__(self, broker_address, topic):
        self.broker_address = broker_address
        self.topic = topic
        self.client = mqtt.Client()

    def on_message(self, client, userdata, message):
        data = message.payload.decode("utf-8")
        print(f"Received message: {data}")

    def subscribe(self):
        self.client.on_message = self.on_message
        self.client.connect(self.broker_address)
        self.client.subscribe(self.topic)
        self.client.loop_forever()