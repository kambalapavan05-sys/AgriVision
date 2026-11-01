from typing import List, Optional
from fastapi import APIRouter, Query
from app.crud import (
    get_kpi_summary,
    get_historical_trends,
    get_state_comparison,
    get_crop_distribution,
    get_seasonal_statistics,
    get_rainfall_production_scatter
)
from app.models import (
    KPISummary,
    TrendPoint,
    StateComparisonItem,
    CropDistributionItem,
    SeasonalStatItem,
    ScatterResponse
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/kpis", response_model=KPISummary)
def get_kpis(
    state: Optional[str] = Query(None, description="State filter"),
    district: Optional[str] = Query(None, description="District filter"),
    crop: Optional[str] = Query(None, description="Crop filter"),
    year_start: Optional[int] = Query(None, description="Start year"),
    year_end: Optional[int] = Query(None, description="End year"),
    season: Optional[str] = Query(None, description="Season filter")
):
    """
    Computes overall total production (MT), total cultivated area (Ha),
    strictly aggregate yield (Total Production / Total Area in MT/Ha), and rainfall statistics.
    """
    return get_kpi_summary(state, district, crop, year_start, year_end, season)

@router.get("/trends", response_model=List[TrendPoint])
def get_trends(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    year_start: Optional[int] = Query(None),
    year_end: Optional[int] = Query(None),
    season: Optional[str] = Query(None)
):
    """Returns annual production, area, aggregate yield, and rainfall trends."""
    return get_historical_trends(state, district, crop, year_start, year_end, season)

@router.get("/state-comparison", response_model=List[StateComparisonItem])
def get_state_comparisons(
    crop: Optional[str] = Query(None),
    year_start: Optional[int] = Query(None),
    year_end: Optional[int] = Query(None),
    season: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50)
):
    """Returns ranking of states by total production and their aggregate yields."""
    return get_state_comparison(crop, year_start, year_end, season, limit)

@router.get("/crop-distribution", response_model=List[CropDistributionItem])
def get_crop_distributions(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    year_start: Optional[int] = Query(None),
    year_end: Optional[int] = Query(None),
    season: Optional[str] = Query(None)
):
    """Returns crop production breakdown and percentage market shares."""
    return get_crop_distribution(state, district, year_start, year_end, season)

@router.get("/seasonal", response_model=List[SeasonalStatItem])
def get_seasonal(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    year_start: Optional[int] = Query(None),
    year_end: Optional[int] = Query(None)
):
    """Returns seasonal comparisons (Kharif, Rabi, Zaid, Whole Year)."""
    return get_seasonal_statistics(state, district, crop, year_start, year_end)

@router.get("/rainfall-production", response_model=ScatterResponse)
def get_rainfall_production(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    year_start: Optional[int] = Query(None),
    year_end: Optional[int] = Query(None),
    season: Optional[str] = Query(None),
    sample_limit: int = Query(250, ge=10, le=1000)
):
    """
    Returns rainfall vs production & yield scatter plot data with computed Pearson r correlation
    and strict scientific disclaimer regarding non-causality.
    """
    return get_rainfall_production_scatter(state, district, crop, year_start, year_end, season, sample_limit)
