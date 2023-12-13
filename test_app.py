import unittest
from app import app

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        with app.app_context():
            app.config['TESTING'] = True


    def test_get_sensor_data(self):
        response = self.app.get('/sensor-data')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('air_temp', data)
        self.assertIn('soil_temp', data)
        self.assertIn('ph', data)
        self.assertIn('soil_moisture', data)
        self.assertIn('electrical_consumption', data)
        self.assertIn('reservoir_l1', data)
        self.assertIn('reservoir_l2', data)
        self.assertIn('co2', data)
        self.assertIn('light', data)
        
    def test_login(self):
        response = self.app.get('/login')
        self.assertEqual(response.status_code, 200)

    def test_serve_robots(self):
        response = self.app.get('/robots.txt')
        self.assertEqual(response.status_code, 200)

    def test_water_plant(self):
        response = self.app.post('/water-plant')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['message'], 'Regando')



if __name__ == '__main__':
    unittest.main()
