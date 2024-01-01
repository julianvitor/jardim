import sys
import unittest
import asyncio
from fastapi.testclient import TestClient
sys.path.append('.')  # Adiciona a lista de onde o Python busca módulos

from serviços.sensores.mainSensores import app as sensores_app
from serviços.regar.mainRegar import app as regar_app
from serviços.cadastro.mainCadastro import app as cadastro_app

class TestMyAPI(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.client_sensores = TestClient(sensores_app)
        self.client_regar = TestClient(regar_app)
        self.client_cadastro = TestClient(cadastro_app)

    async def test_get_sensores(self):
        response = self.client_sensores.get('/sensor-data')
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
        response = self.client_regar.post('/water-plant')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['message'], 'Regando')

    async def test_cadastro_positivo(self):
        dados_usuario = {"usuario": "usuario_teste", "senha": "senha_teste"}
        response = self.client_cadastro.post('/cadastro', json=dados_usuario)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['message'], 'Cadastro realizado com sucesso.')


if __name__ == '__main__':
    asyncio.run(unittest.main())
