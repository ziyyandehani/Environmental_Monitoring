import unittest
from services.gateway.src.aggregator import Aggregator

class TestAggregator(unittest.TestCase):

    def setUp(self):
        self.aggregator = Aggregator()

    def test_aggregate_data(self):
        test_data = [
            {'sensor_id': 'sensor_1', 'temperature': 22.5, 'humidity': 60},
            {'sensor_id': 'sensor_2', 'temperature': 23.0, 'humidity': 55},
            {'sensor_id': 'sensor_1', 'temperature': 21.5, 'humidity': 65},
        ]
        expected_result = {
            'sensor_1': {'temperature': [22.5, 21.5], 'humidity': [60, 65]},
            'sensor_2': {'temperature': [23.0], 'humidity': [55]},
        }
        for data in test_data:
            self.aggregator.aggregate(data)
        self.assertEqual(self.aggregator.get_aggregated_data(), expected_result)

    def test_clear_data(self):
        test_data = [
            {'sensor_id': 'sensor_1', 'temperature': 22.5, 'humidity': 60},
        ]
        for data in test_data:
            self.aggregator.aggregate(data)
        self.aggregator.clear()
        self.assertEqual(self.aggregator.get_aggregated_data(), {})

if __name__ == '__main__':
    unittest.main()