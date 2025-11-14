from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_predict_bad_request():
    r = client.post("/predict", json={"text": ""})
    assert r.status_code == 400
