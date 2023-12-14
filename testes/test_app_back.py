import sys
import unittest
from fastapi.testclient import TestClient
sys.path.append('.')#adiciona a lista de onde o python busca módulos
from gateway import app

class TestMyAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    async def test_get_sensores(self):
        response = await self.client.get('/sensor-data')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('air_temp', data)
        self.assertIn('soil_temp', data)
        self.assertIn('ph', data)
        self.assertIn('soil_moisture', data)
        self.assertIn('electrical_consumption', data)
        self.assertIn('reservoir_l1', data)
        self.assertIn('reservoir_l2', data)
        self.assertIn('co2', data)
        self.assertIn('light', data)

    async def test_water_plant(self):
        response = await self.client.post('/water-plant')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['message'], 'Regando')

if __name__ == '__main__':
    unittest.main()
