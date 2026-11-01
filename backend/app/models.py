from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class KPISummary(BaseModel):
    total_production_tonnes: float = Field(..., description="Total production in Metric Tonnes (MT)")
    total_area_hectares: float = Field(..., description="Total cultivated area in Hectares (Ha)")
    aggregate_yield: float = Field(..., description="Aggregate yield in MT/Ha (Total Production / Total Area)")
    average_rainfall_mm: float = Field(..., description="Weighted / mean rainfall in Millimeters (mm)")
    record_count: int = Field(..., description="Total number of matching agricultural records")
    is_demo: bool = True
    data_note: str = "DEMO DATASET – Simulated historical agricultural metrics (2000-2023). Not real production data."

class TrendPoint(BaseModel):
    year: int
    production_tonnes: float
    area_hectares: float
    aggregate_yield: float
    rainfall_mm: float

class StateComparisonItem(BaseModel):
    state: str
    production_tonnes: float
    area_hectares: float
    aggregate_yield: float
    record_count: int

class CropDistributionItem(BaseModel):
    crop: str
    production_tonnes: float
    area_hectares: float
    aggregate_yield: float
    percentage_share: float

class SeasonalStatItem(BaseModel):
    season: str
    production_tonnes: float
    area_hectares: float
    aggregate_yield: float

class ScatterPoint(BaseModel):
    id: int
    crop: str
    state: str
    district: str
    crop_year: int
    rainfall_mm: float
    production_tonnes: float
    yield_tonnes_per_ha: float

class ScatterResponse(BaseModel):
    points: List[ScatterPoint]
    pearson_r: Optional[float]
    sample_size: int
    correlation_interpretation: str
    disclaimer: str = (
        "Scientific Disclaimer: Rainfall figures represent observed seasonal precipitation. "
        "Agricultural production is governed by complex agronomic factors (irrigation, soil quality, seed hybrid, "
        "fertilizer application, pest management, and heat stress). No causal relationship is implied."
    )

class CropRecord(BaseModel):
    id: int
    state: str
    district: str
    crop: str
    crop_year: int
    season: str
    area_hectares: float
    production_tonnes: float
    yield_tonnes_per_ha: float
    rainfall_mm: float
    is_demo: bool

class PaginatedRecords(BaseModel):
    items: List[CropRecord]
    total: int
    page: int
    page_size: int
    total_pages: int

class FilterOptionsResponse(BaseModel):
    states: List[str]
    districts_by_state: Dict[str, List[str]]
    crops: List[str]
    seasons: List[str]
    years: List[int]
    min_year: int
    max_year: int
    total_records: int
    dataset_is_demo: bool

class ValidationErrorItem(BaseModel):
    row_number: int
    field: str
    message: str
    value: Optional[str] = None

class UploadValidationResponse(BaseModel):
    valid: bool
    total_rows: int
    valid_rows_count: int
    invalid_rows_count: int
    errors: List[ValidationErrorItem]
    preview: List[Dict]
    dataset_name: str

class UploadCommitResponse(BaseModel):
    message: str
    rows_inserted: int
    total_db_records: int
