import pytest
from fastapi.testclient import TestClient
from ..app.main import app

client = TestClient(app)

@pytest.mark.parametrize("endpoint", ["/api/health/db"])
def test_db_healthcheck_connection(endpoint):
    """
    Test that the /api/health/db endpoint returns a status code 200 and
    the correct response if the database is accessible.
    """
    response = client.get(endpoint)
    print(response)
    assert response.status_code == 200
    data = response.json()
    assert data["db_status"] == "connected"
    
@pytest.mark.parametrize("endpoint", ["/api/health/"])
def test_healthcheck_connection(endpoint):
    """
    Simple healthcheck test.
    """
    response = client.get(endpoint)
    assert response.status_code == 200