import unittest
from services.collector.src.api import app

class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_get_data(self):
        response = self.app.get('/api/data')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)

    def test_post_data(self):
        response = self.app.post('/api/data', json={'temperature': 22.5, 'humidity': 60})
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.json)

    def test_get_data_empty(self):
        response = self.app.get('/api/data')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 0)

if __name__ == '__main__':
    unittest.main()