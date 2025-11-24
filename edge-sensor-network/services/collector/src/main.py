# from flask import Flask, jsonify, request
# from storage import DataStorage

# app = Flask(__name__)
# data_storage = DataStorage()

# @app.route('/data', methods=['GET'])
# def get_data():
#     return jsonify(data_storage.get_all_data()), 200

# @app.route('/data', methods=['POST'])
# def post_data():
#     data = request.json
#     data_storage.save_data(data)
#     return jsonify({"message": "Data saved successfully"}), 201

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)

import os
from mqtt_subscriber import MQTTSubscriber
from aggregator import Aggregator

def main():
    broker = os.environ.get("MQTT_BROKER", "mosquitto")
    topic = os.environ.get("MQTT_TOPIC", "environmental_data")
    subscriber = MQTTSubscriber(broker_address=broker, topic=topic)
    aggregator = Aggregator()
    subscriber.subscribe(aggregator.handle_message)
    subscriber.loop_forever()

if __name__ == "__main__":
    main()