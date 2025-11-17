class Sensor:
    def __init__(self, sensor_id, sensor_type, mqtt_publisher):
        self.sensor_id = sensor_id
        self.sensor_type = sensor_type
        self.mqtt_publisher = mqtt_publisher
        self.data = {}

    def collect_data(self):
        # Simulate data collection
        if self.sensor_type == "temperature":
            self.data = {"temperature": self.get_temperature()}
        elif self.sensor_type == "humidity":
            self.data = {"humidity": self.get_humidity()}
        elif self.sensor_type == "air_quality":
            self.data = {"air_quality": self.get_air_quality()}
        
        self.publish_data()

    def get_temperature(self):
        # Placeholder for actual temperature reading logic
        return 25.0  # Example temperature

    def get_humidity(self):
        # Placeholder for actual humidity reading logic
        return 60.0  # Example humidity

    def get_air_quality(self):
        # Placeholder for actual air quality reading logic
        return 50.0  # Example air quality index

    def publish_data(self):
        self.mqtt_publisher.publish(self.sensor_id, self.data)