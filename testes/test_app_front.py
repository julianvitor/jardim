import sys
import unittest
sys.path.append('.') #adiciona a lista de onde o python busca módulos
from views import app

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        with app.app_context():
            app.config['TESTING'] = True

    def teste_serve_robots(self):
        response = self.app.get('/robots.txt')
        self.assertEqual(response.status_code, 200)

    def teste_acessar_cadastro(self):
        response = self.app.get('cadastro')
        self.assertEqual(response.status_code, 200)

    def teste_acessar_login(self):
        response = self.app.get('/login')
        self.assertEqual(response.status_code, 200)

    def test_acessar_dashboard(self):
        response = self.app.get('/dashboard')
        self.assertEqual(response.status_code, 200)

    def test_acessar_index(self):
        response  = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        
if __name__ == '__main__':
    unittest.main()
