from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_random_level():
    response = client.get("/api/level/random?width=3&height=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert len(data[0]) == 3
    # Check structure of a tile
    assert "type" in data[0][0]
    assert "rotation" in data[0][0]
    assert "locked" in data[0][0]

def test_get_daily_level():
    response = client.get("/api/level/daily")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 7 # Daily level is hardcoded 7x7
    assert len(data[0]) == 7
