from flask import Flask, jsonify, request
from storage import DataStorage

app = Flask(__name__)
data_storage = DataStorage()

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(data_storage.get_all_data()), 200

@app.route('/data', methods=['POST'])
def post_data():
    new_data = request.json
    data_storage.save_data(new_data)
    return jsonify({"message": "Data saved successfully"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)