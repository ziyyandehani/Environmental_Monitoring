from mqtt_subscriber import MQTTSubscriber
from aggregator import Aggregator

def main():
    subscriber = MQTTSubscriber()
    aggregator = Aggregator()

    subscriber.start_listening(aggregator.process_data)

if __name__ == "__main__":
    main()