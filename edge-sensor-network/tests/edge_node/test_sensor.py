import unittest
from services.edge_node.src.sensor import Sensor

class TestSensor(unittest.TestCase):

    def setUp(self):
        self.sensor = Sensor()

    def test_collect_temperature(self):
        temperature = self.sensor.collect_temperature()
        self.assertIsInstance(temperature, float)
        self.assertGreaterEqual(temperature, -50.0)
        self.assertLessEqual(temperature, 50.0)

    def test_collect_humidity(self):
        humidity = self.sensor.collect_humidity()
        self.assertIsInstance(humidity, float)
        self.assertGreaterEqual(humidity, 0.0)
        self.assertLessEqual(humidity, 100.0)

    def test_collect_air_quality(self):
        air_quality = self.sensor.collect_air_quality()
        self.assertIsInstance(air_quality, float)
        self.assertGreaterEqual(air_quality, 0.0)

if __name__ == '__main__':
    unittest.main()