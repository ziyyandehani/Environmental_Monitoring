class SensorManager:
    def __init__(self, sensor_classes):
        self.sensors = [sensor_class() for sensor_class in sensor_classes]

    def start_data_collection(self):
        import threading

        def collect_data(sensor):
            while True:
                data = sensor.collect_data()
                sensor.publish_data(data)

        threads = []
        for sensor in self.sensors:
            thread = threading.Thread(target=collect_data, args=(sensor,))
            thread.start()
            threads.append(thread)

        for thread in threads:
            thread.join()