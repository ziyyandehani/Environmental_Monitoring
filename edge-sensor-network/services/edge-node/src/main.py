import threading
import time
import yaml
from sensor_manager import SensorManager

def load_config():
    with open('config.yaml', 'r') as file:
        return yaml.safe_load(file)

def main():
    config = load_config()
    sensor_manager = SensorManager(config['sensors'])
    
    # Start data collection in separate threads for each sensor
    threads = []
    for sensor in sensor_manager.sensors:
        thread = threading.Thread(target=sensor_manager.collect_data, args=(sensor,))
        threads.append(thread)
        thread.start()

    # Join threads to ensure they complete
    for thread in threads:
        thread.join()

if __name__ == "__main__":
    main()