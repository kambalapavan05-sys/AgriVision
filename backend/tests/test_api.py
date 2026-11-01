import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db
from app.data_loader import seed_demo_data_if_empty

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_db()
    seed_demo_data_if_empty()

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["total_records"] > 0
    assert "DEMO DATASET" in data["dataset_notice"]

def test_metadata_filters():
    response = client.get("/api/metadata/filters")
    assert response.status_code == 200
    data = response.json()
    assert len(data["states"]) > 0
    assert "Punjab" in data["states"]
    assert "Wheat" in data["crops"]
    assert data["min_year"] <= 2000
    assert data["max_year"] >= 2023
    assert data["dataset_is_demo"] is True

def test_analytics_kpis():
    response = client.get("/api/analytics/kpis")
    assert response.status_code == 200
    data = response.json()
    assert data["total_production_tonnes"] > 0
    assert data["total_area_hectares"] > 0
    # Aggregate yield formula: total production / total area
    expected_yield = round(data["total_production_tonnes"] / data["total_area_hectares"], 3)
    assert abs(data["aggregate_yield"] - expected_yield) < 0.01
    assert data["is_demo"] is True

def test_analytics_kpis_filtered():
    response = client.get("/api/analytics/kpis?state=Punjab&crop=Wheat")
    assert response.status_code == 200
    data = response.json()
    assert data["record_count"] > 0
    assert data["total_production_tonnes"] > 0

def test_analytics_trends():
    response = client.get("/api/analytics/trends?crop=Rice")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # verify ascending years
    years = [item["year"] for item in data]
    assert years == sorted(years)
    for item in data:
        assert "production_tonnes" in item
        assert "area_hectares" in item
        assert "aggregate_yield" in item
        assert "rainfall_mm" in item

def test_analytics_state_comparison():
    response = client.get("/api/analytics/state-comparison?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 5
    # verify descending production order
    productions = [item["production_tonnes"] for item in data]
    assert productions == sorted(productions, reverse=True)

def test_analytics_crop_distribution():
    response = client.get("/api/analytics/crop-distribution")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    total_pct = sum(item["percentage_share"] for item in data)
    assert 99.0 <= total_pct <= 101.0  # approximate 100%

def test_analytics_rainfall_scatter():
    response = client.get("/api/analytics/rainfall-production?sample_limit=50")
    assert response.status_code == 200
    data = response.json()
    assert "points" in data
    assert "disclaimer" in data
    assert "Correlation does not imply causality" in data["disclaimer"]
    assert "pearson_r" in data

def test_records_pagination_and_search():
    # Page 1
    res1 = client.get("/api/records?page=1&page_size=10&sort_by=crop_year&sort_order=desc")
    assert res1.status_code == 200
    data1 = res1.json()
    assert len(data1["items"]) == 10
    assert data1["total"] > 10
    assert data1["page"] == 1

    # Search filter
    res_search = client.get("/api/records?search=Ludhiana")
    assert res_search.status_code == 200
    search_data = res_search.json()
    for item in search_data["items"]:
        assert "ludhiana" in item["district"].lower()

def test_csv_upload_validation_and_template():
    # Download sample template
    tmpl_res = client.get("/api/upload/sample")
    assert tmpl_res.status_code == 200
    assert "state,district,crop" in tmpl_res.text

    # Validate valid CSV
    files = {"file": ("test_sample.csv", tmpl_res.text, "text/csv")}
    val_res = client.post("/api/upload/validate", files=files)
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["valid"] is True
    assert val_data["valid_rows_count"] > 0
    assert len(val_data["errors"]) == 0

    # Validate invalid CSV (missing headers)
    bad_csv = "col1,col2\nval1,val2\n"
    bad_files = {"file": ("bad.csv", bad_csv, "text/csv")}
    bad_res = client.post("/api/upload/validate", files=bad_files)
    assert bad_res.status_code == 200
    bad_data = bad_res.json()
    assert bad_data["valid"] is False
    assert len(bad_data["errors"]) > 0

def test_records_export():
    csv_res = client.get("/api/records/export?format=csv")
    assert csv_res.status_code == 200
    assert "state,district,crop" in csv_res.text

    json_res = client.get("/api/records/export?format=json")
    assert json_res.status_code == 200
    json_data = json_res.json()
    assert isinstance(json_data, list)
    assert len(json_data) > 0
