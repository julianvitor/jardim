import logging
import random
import string
import sys
import unittest
import asyncio
from fastapi.testclient import TestClient

# Importar os apps e demais dependências necessárias
sys.path.append('.')
from servicos.sensores.mainSensores import app as sensores_app
from servicos.regar.mainRegar import app as regar_app
from servicos.cadastro.mainCadastro import app as cadastro_app
from servicos.cadastro.mainCadastro import HandlerDb as cadastro_HandlerDb
from servicos.gerenciamento.mainGerenciamento import app as gerenciamento_app
from servicos.login.mainLogin import app as login_app
from servicos.login.mainLogin import HandlerDb as login_HandlerDb

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class TestMyAPI(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.client = TestClient(cadastro_app)
        self.client_sensores = TestClient(sensores_app)
        self.client_regar = TestClient(regar_app)
        self.client_cadastro = TestClient(cadastro_app)
        self.client_gerenciamento = TestClient(gerenciamento_app)
        self.client_login = TestClient(login_app)

    async def test_get_sensores(self):
        response = self.client_sensores.get('/api-sensor-data')
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
        response = self.client_regar.post('/api-water-plant')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['message'], 'Regando')
    
    async def test_cadastro_positivo(self):
        usuario = ''.join(random.choices(string.ascii_letters, k=20))
        senha = ''.join(random.choices(string.ascii_letters, k=20))
        dados_usuario = {"usuario": usuario, "senha": senha}
        response = self.client_cadastro.post('/api-cadastro', json=dados_usuario)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['detail'], 'Cadastro realizado com sucesso.')

    async def test_cadastro_existente(self):
        usuario = "batata"
        senha = "12345678"
        dados_usuario = {"usuario": usuario, "senha": senha}
        response = self.client_cadastro.post('/api-cadastro', json=dados_usuario)
        #repete o cadastro
        usuario = "batata"
        senha = "12345678"
        dados_usuario = {"usuario": usuario, "senha": senha}
        response = self.client_cadastro.post('/api-cadastro', json=dados_usuario)
        self.assertEqual(response.status_code, 400)

    async def test_gerenciamento_cidade(self):
        response = self.client_gerencimento.get('/api-search-city', params={"city":"carbonita"}) #parametros na url da solicitação
        self.assertEqual(response.status_code, 200)

    async def test_login_existente(self):
        usuario = "batata"
        senha = "12345678"
        dados_usuario = {"usuario": usuario, "senha": senha}
        response = self.client_login.post('/api-login', json=dados_usuario)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['detail'], 'Login realizado com sucesso.')
        
    async def test_login_inexistente(self):
        usuario = ''.join(random.choices(string.ascii_letters, k=20))
        senha = ''.join(random.choices(string.ascii_letters, k=20))
        dados_usuario = {"usuario": usuario, "senha": senha}
        response = self.client_login.post('/api-login', json=dados_usuario)
        self.assertEqual(response.status_code, 401)  # Espera um código de status 401, pois o login deve falhar
    
if __name__ == '__main__':
    asyncio.run(unittest.main())
