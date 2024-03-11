import sys
sys.path.append('.')
import logging
import random
import string
from fastapi.testclient import TestClient
from servicos.sensores.mainSensores import app as sensores_app
from servicos.regar.mainRegar import app as regar_app
from servicos.cadastro.mainCadastro import app as cadastro_app
from servicos.cadastro.mainCadastro import ao_ligar as ao_ligar_cadastro
from servicos.cadastro.mainCadastro import ao_desligar as ao_desligar_cadastro
from servicos.gerenciamento.mainGerenciamento import app as gerenciamento_app
from servicos.login.mainLogin import app as login_app
from servicos.login.mainLogin import ao_ligar as ao_ligar_login
from servicos.login.mainLogin import ao_desligar as ao_desligar_login
import pytest
from fastapi.testclient import TestClient
import logging
import random
import string

# Importar os apps e demais dependências necessárias
from servicos.sensores.mainSensores import app as sensores_app
from servicos.regar.mainRegar import app as regar_app
from servicos.cadastro.mainCadastro import app as cadastro_app
from servicos.cadastro.mainCadastro import ao_ligar as ao_ligar_cadastro
from servicos.cadastro.mainCadastro import ao_desligar as ao_desligar_cadastro
from servicos.gerenciamento.mainGerenciamento import app as gerenciamento_app
from servicos.login.mainLogin import app as login_app
from servicos.login.mainLogin import ao_ligar as ao_ligar_login
from servicos.login.mainLogin import ao_desligar as ao_desligar_login

DATABASE_URL_CONF = "postgresql://usuario:senha@localhost:5432/banco_jardim_teste"

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

client = TestClient(cadastro_app)
client_sensores = TestClient(sensores_app)
client_regar = TestClient(regar_app)
client_cadastro = TestClient(cadastro_app)
client_gerenciamento = TestClient(gerenciamento_app)
client_login = TestClient(login_app)

def test_get_sensores():
    response = client_sensores.get('/api-sensor-data')
    assert response.status_code == 200
    data = response.json()
    assert 'air_temp' in data
    assert 'soil_temp' in data
    assert 'ph' in data
    assert 'soil_moisture' in data
    assert 'electrical_consumption' in data
    assert 'reservoir_l1' in data
    assert 'reservoir_l2' in data
    assert 'co2' in data
    assert 'light' in data

def test_water_plant():
    response = client_regar.post('/api-water-plant')
    assert response.status_code == 200
    data = response.json()
    assert data['message'] == 'Regando'
@pytest.mark.anyio
def test_cadastro_positivo():
    usuario = ''.join(random.choices(string.ascii_letters, k=20))
    senha = ''.join(random.choices(string.ascii_letters, k=20))
    dados_usuario = {"usuario": usuario, "senha": senha}
    response = client_cadastro.post('/api-cadastro', json=dados_usuario)
    assert response.status_code == 200
    data = response.json()
    assert data['detail'] == 'Cadastro realizado com sucesso.'
@pytest.mark.anyio
def test_cadastro_existente():
    usuario = "batata"
    senha = "12345678"
    dados_usuario = {"usuario": usuario, "senha": senha}
    response = client_cadastro.post('/api-cadastro', json=dados_usuario)
    # repete o cadastro
    usuario = "batata"
    senha = "12345678"
    dados_usuario = {"usuario": usuario, "senha": senha}
    response = client_cadastro.post('/api-cadastro', json=dados_usuario)
    assert response.status_code == 400

def test_gerenciamento_cidade():
    response = client_gerenciamento.get('/api-search-city', params={"city": "carbonita"})
    assert response.status_code == 200
@pytest.mark.anyio
def test_login_existente():
    usuario = "batata"
    senha = "12345678"
    dados_usuario = {"usuario": usuario, "senha": senha}
    response = client_login.post('/api-login', json=dados_usuario)
    assert response.status_code == 200
    data = response.json()
    assert data['detail'] == 'Login realizado com sucesso.'
@pytest.mark.anyio
def test_login_inexistente():
    usuario = ''.join(random.choices(string.ascii_letters, k=20))
    senha = ''.join(random.choices(string.ascii_letters, k=20))
    dados_usuario = {"usuario": usuario, "senha": senha}
    response = client_login.post('/api-login', json=dados_usuario)
    assert response.status_code == 401
