from fastapi.testclient import TestClient
from gateway import app  

# Cria um cliente de teste
client = TestClient(app)

def test_get_sensores():
    response = client.get('/sensor-data')
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
    response = client.post('/water-plant')
    assert response.status_code == 200
    data = response.json()
    assert data['message'] == 'Regando'
