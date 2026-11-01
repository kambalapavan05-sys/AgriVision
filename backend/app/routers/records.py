import csv
import io
import json
from typing import Optional
from fastapi import APIRouter, Query, Response
from app.crud import get_paginated_records, get_export_rows
from app.models import PaginatedRecords

router = APIRouter(prefix="/api/records", tags=["Records"])

@router.get("", response_model=PaginatedRecords)
def list_records(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    year_start: Optional[int] = Query(None),
    year_end: Optional[int] = Query(None),
    season: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=5, le=100),
    sort_by: str = Query("crop_year"),
    sort_order: str = Query("desc")
):
    """Retrieve filtered, searchable, sortable agricultural production records with pagination."""
    return get_paginated_records(
        state=state,
        district=district,
        crop=crop,
        year_start=year_start,
        year_end=year_end,
        season=season,
        search=search,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/export")
def export_records(
    format: str = Query("csv", pattern="^(csv|json)$"),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    year_start: Optional[int] = Query(None),
    year_end: Optional[int] = Query(None),
    season: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """Export filtered dataset to CSV or JSON format."""
    rows = get_export_rows(
        state=state,
        district=district,
        crop=crop,
        year_start=year_start,
        year_end=year_end,
        season=season,
        search=search
    )

    if format.lower() == "json":
        content = json.dumps(rows, indent=2)
        return Response(
            content=content,
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=agrivision_filtered_data.json"}
        )

    # Default CSV
    output = io.StringIO()
    if rows:
        fieldnames = list(rows[0].keys())
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    else:
        output.write("id,state,district,crop,crop_year,season,area_hectares,production_tonnes,yield_tonnes_per_ha,rainfall_mm,data_source\n")

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=agrivision_filtered_data.csv"}
    )
