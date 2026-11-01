import math
from typing import Any, Dict, List, Optional, Tuple
from app.database import get_db_connection

def build_filter_clauses(
    state: Optional[str] = None,
    district: Optional[str] = None,
    crop: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    season: Optional[str] = None,
    search: Optional[str] = None
) -> Tuple[str, Dict[str, Any]]:
    clauses = ["1=1"]
    params = {}

    if state and state.strip() and state.lower() != "all":
        clauses.append("state = :state")
        params["state"] = state.strip()

    if district and district.strip() and district.lower() != "all":
        clauses.append("district = :district")
        params["district"] = district.strip()

    if crop and crop.strip() and crop.lower() != "all":
        clauses.append("crop = :crop")
        params["crop"] = crop.strip()

    if season and season.strip() and season.lower() != "all":
        clauses.append("season = :season")
        params["season"] = season.strip()

    if year_start is not None:
        clauses.append("crop_year >= :year_start")
        params["year_start"] = year_start

    if year_end is not None:
        clauses.append("crop_year <= :year_end")
        params["year_end"] = year_end

    if search and search.strip():
        clauses.append("""
            (state LIKE :search 
             OR district LIKE :search 
             OR crop LIKE :search 
             OR season LIKE :search
             OR CAST(crop_year AS TEXT) LIKE :search)
        """)
        params["search"] = f"%{search.strip()}%"

    return " AND ".join(clauses), params

def get_filter_options() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT state FROM crop_production ORDER BY state")
    states = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT state, district FROM crop_production ORDER BY state, district")
    districts_by_state: Dict[str, List[str]] = {}
    for state, district in cursor.fetchall():
        if state not in districts_by_state:
            districts_by_state[state] = []
        districts_by_state[state].append(district)

    cursor.execute("SELECT DISTINCT crop FROM crop_production ORDER BY crop")
    crops = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT season FROM crop_production ORDER BY season")
    seasons = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT MIN(crop_year), MAX(crop_year), COUNT(*) FROM crop_production")
    min_year, max_year, total_records = cursor.fetchone()

    cursor.execute("SELECT DISTINCT crop_year FROM crop_production ORDER BY crop_year")
    years = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT COUNT(*) FROM crop_production WHERE is_demo = 1")
    demo_count = cursor.fetchone()[0]

    conn.close()

    return {
        "states": states,
        "districts_by_state": districts_by_state,
        "crops": crops,
        "seasons": seasons,
        "years": years,
        "min_year": min_year or 2000,
        "max_year": max_year or 2023,
        "total_records": total_records or 0,
        "dataset_is_demo": (demo_count > 0)
    }

def get_kpi_summary(
    state: Optional[str] = None,
    district: Optional[str] = None,
    crop: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    season: Optional[str] = None
) -> Dict[str, Any]:
    where_clause, params = build_filter_clauses(state, district, crop, year_start, year_end, season)
    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"""
        SELECT 
            COALESCE(SUM(production_tonnes), 0.0) as total_production,
            COALESCE(SUM(area_hectares), 0.0) as total_area,
            COALESCE(AVG(rainfall_mm), 0.0) as avg_rainfall,
            COUNT(*) as record_count,
            MAX(is_demo) as is_demo
        FROM crop_production
        WHERE {where_clause}
    """
    cursor.execute(query, params)
    row = cursor.fetchone()
    conn.close()

    total_prod = float(row["total_production"] or 0.0)
    total_area = float(row["total_area"] or 0.0)
    avg_rain = float(row["avg_rainfall"] or 0.0)
    rec_count = int(row["record_count"] or 0)
    is_demo = bool(row["is_demo"] if row["is_demo"] is not None else 1)

    # Strictly compute aggregate yield as total production / total area
    aggregate_yield = round(total_prod / total_area, 3) if total_area > 0 else 0.0

    return {
        "total_production_tonnes": round(total_prod, 2),
        "total_area_hectares": round(total_area, 2),
        "aggregate_yield": aggregate_yield,
        "average_rainfall_mm": round(avg_rain, 1),
        "record_count": rec_count,
        "is_demo": is_demo,
        "data_note": "DEMO DATASET – Synthetic historical agricultural metrics (2000-2023). For demonstration & analytical use only." if is_demo else "Verified User Uploaded Dataset"
    }

def get_historical_trends(
    state: Optional[str] = None,
    district: Optional[str] = None,
    crop: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    season: Optional[str] = None
) -> List[Dict[str, Any]]:
    where_clause, params = build_filter_clauses(state, district, crop, year_start, year_end, season)
    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"""
        SELECT 
            crop_year as year,
            COALESCE(SUM(production_tonnes), 0.0) as production_tonnes,
            COALESCE(SUM(area_hectares), 0.0) as area_hectares,
            COALESCE(AVG(rainfall_mm), 0.0) as rainfall_mm
        FROM crop_production
        WHERE {where_clause}
        GROUP BY crop_year
        ORDER BY crop_year ASC
    """
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    trends = []
    for r in rows:
        prod = float(r["production_tonnes"])
        area = float(r["area_hectares"])
        agg_yield = round(prod / area, 3) if area > 0 else 0.0
        trends.append({
            "year": int(r["year"]),
            "production_tonnes": round(prod, 2),
            "area_hectares": round(area, 2),
            "aggregate_yield": agg_yield,
            "rainfall_mm": round(float(r["rainfall_mm"]), 1)
        })
    return trends

def get_state_comparison(
    crop: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    season: Optional[str] = None,
    limit: int = 10
) -> List[Dict[str, Any]]:
    where_clause, params = build_filter_clauses(None, None, crop, year_start, year_end, season)
    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"""
        SELECT 
            state,
            COALESCE(SUM(production_tonnes), 0.0) as production_tonnes,
            COALESCE(SUM(area_hectares), 0.0) as area_hectares,
            COUNT(*) as record_count
        FROM crop_production
        WHERE {where_clause}
        GROUP BY state
        ORDER BY production_tonnes DESC
        LIMIT {limit}
    """
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    items = []
    for r in rows:
        prod = float(r["production_tonnes"])
        area = float(r["area_hectares"])
        agg_yield = round(prod / area, 3) if area > 0 else 0.0
        items.append({
            "state": str(r["state"]),
            "production_tonnes": round(prod, 2),
            "area_hectares": round(area, 2),
            "aggregate_yield": agg_yield,
            "record_count": int(r["record_count"])
        })
    return items

def get_crop_distribution(
    state: Optional[str] = None,
    district: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    season: Optional[str] = None
) -> List[Dict[str, Any]]:
    where_clause, params = build_filter_clauses(state, district, None, year_start, year_end, season)
    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"""
        SELECT 
            crop,
            COALESCE(SUM(production_tonnes), 0.0) as production_tonnes,
            COALESCE(SUM(area_hectares), 0.0) as area_hectares
        FROM crop_production
        WHERE {where_clause}
        GROUP BY crop
        ORDER BY production_tonnes DESC
    """
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    total_prod_all_crops = sum(float(r["production_tonnes"]) for r in rows)

    distribution = []
    for r in rows:
        prod = float(r["production_tonnes"])
        area = float(r["area_hectares"])
        agg_yield = round(prod / area, 3) if area > 0 else 0.0
        pct = round((prod / total_prod_all_crops * 100), 2) if total_prod_all_crops > 0 else 0.0
        distribution.append({
            "crop": str(r["crop"]),
            "production_tonnes": round(prod, 2),
            "area_hectares": round(area, 2),
            "aggregate_yield": agg_yield,
            "percentage_share": pct
        })
    return distribution

def get_seasonal_statistics(
    state: Optional[str] = None,
    district: Optional[str] = None,
    crop: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None
) -> List[Dict[str, Any]]:
    where_clause, params = build_filter_clauses(state, district, crop, year_start, year_end, None)
    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"""
        SELECT 
            season,
            COALESCE(SUM(production_tonnes), 0.0) as production_tonnes,
            COALESCE(SUM(area_hectares), 0.0) as area_hectares
        FROM crop_production
        WHERE {where_clause}
        GROUP BY season
        ORDER BY production_tonnes DESC
    """
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    res = []
    for r in rows:
        prod = float(r["production_tonnes"])
        area = float(r["area_hectares"])
        agg_yield = round(prod / area, 3) if area > 0 else 0.0
        res.append({
            "season": str(r["season"]),
            "production_tonnes": round(prod, 2),
            "area_hectares": round(area, 2),
            "aggregate_yield": agg_yield
        })
    return res

def get_rainfall_production_scatter(
    state: Optional[str] = None,
    district: Optional[str] = None,
    crop: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    season: Optional[str] = None,
    sample_limit: int = 250
) -> Dict[str, Any]:
    where_clause, params = build_filter_clauses(state, district, crop, year_start, year_end, season)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Select representative points with randomized offset to avoid clumped charts
    query = f"""
        SELECT 
            id, state, district, crop, crop_year, rainfall_mm, production_tonnes, area_hectares
        FROM crop_production
        WHERE {where_clause} AND area_hectares > 0
        ORDER BY RANDOM()
        LIMIT {sample_limit}
    """
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    points = []
    xs = []  # rainfall
    ys = []  # yield
    for r in rows:
        area = float(r["area_hectares"])
        prod = float(r["production_tonnes"])
        rain = float(r["rainfall_mm"])
        yld = round(prod / area, 3) if area > 0 else 0.0
        points.append({
            "id": r["id"],
            "state": r["state"],
            "district": r["district"],
            "crop": r["crop"],
            "crop_year": r["crop_year"],
            "rainfall_mm": round(rain, 1),
            "production_tonnes": round(prod, 2),
            "yield_tonnes_per_ha": yld
        })
        xs.append(rain)
        ys.append(yld)

    # Compute Pearson correlation coefficient r between rainfall and yield
    n = len(xs)
    pearson_r = None
    interpretation = "Insufficient data points to calculate correlation."

    if n > 2:
        mean_x = sum(xs) / n
        mean_y = sum(ys) / n
        num = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
        den_x = sum((x - mean_x) ** 2 for x in xs)
        den_y = sum((y - mean_y) ** 2 for y in ys)
        denom = math.sqrt(den_x * den_y)
        if denom > 1e-9:
            pearson_r = round(num / denom, 3)
            if abs(pearson_r) < 0.2:
                strength = "negligible"
            elif abs(pearson_r) < 0.4:
                strength = "weak"
            elif abs(pearson_r) < 0.7:
                strength = "moderate"
            else:
                strength = "strong"
            direction = "positive" if pearson_r > 0 else "negative"
            interpretation = (
                f"Observed statistical correlation r = {pearson_r:.3f} indicates a {strength} {direction} correlation "
                f"between annual precipitation and crop yield across the selected filter scope."
            )
        else:
            pearson_r = 0.0
            interpretation = "Zero variance detected in sample parameters."

    return {
        "points": points,
        "pearson_r": pearson_r,
        "sample_size": n,
        "correlation_interpretation": interpretation,
        "disclaimer": (
            "Scientific & Agronomic Notice: Observed rainfall measures regional precipitation. "
            "Crop production and yield are governed by complex agronomic factors—including irrigation access, "
            "soil nutrient dynamics, crop genetics, mechanization, and pest pressure. "
            "Correlation does not imply causality, and agricultural advice should not be inferred without localized agronomic ground-truth."
        )
    }

def get_paginated_records(
    state: Optional[str] = None,
    district: Optional[str] = None,
    crop: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    season: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 15,
    sort_by: str = "crop_year",
    sort_order: str = "desc"
) -> Dict[str, Any]:
    where_clause, params = build_filter_clauses(state, district, crop, year_start, year_end, season, search)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get total matching rows
    cursor.execute(f"SELECT COUNT(*) FROM crop_production WHERE {where_clause}", params)
    total = cursor.fetchone()[0]

    # Validate sorting column
    allowed_cols = {
        "id": "id",
        "state": "state",
        "district": "district",
        "crop": "crop",
        "crop_year": "crop_year",
        "season": "season",
        "area_hectares": "area_hectares",
        "production_tonnes": "production_tonnes",
        "rainfall_mm": "rainfall_mm",
        "yield": "CASE WHEN area_hectares > 0 THEN production_tonnes / area_hectares ELSE 0 END"
    }
    col_expr = allowed_cols.get(sort_by.lower(), "crop_year")
    direction = "ASC" if sort_order.lower() == "asc" else "DESC"

    offset = max(0, (page - 1) * page_size)
    query = f"""
        SELECT 
            id, state, district, crop, crop_year, season,
            area_hectares, production_tonnes, rainfall_mm, is_demo,
            CASE WHEN area_hectares > 0 THEN ROUND(production_tonnes / area_hectares, 3) ELSE 0.0 END AS yield_tonnes_per_ha
        FROM crop_production
        WHERE {where_clause}
        ORDER BY {col_expr} {direction}
        LIMIT {page_size} OFFSET {offset}
    """
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    items = []
    for r in rows:
        items.append({
            "id": r["id"],
            "state": r["state"],
            "district": r["district"],
            "crop": r["crop"],
            "crop_year": r["crop_year"],
            "season": r["season"],
            "area_hectares": round(float(r["area_hectares"]), 2),
            "production_tonnes": round(float(r["production_tonnes"]), 2),
            "yield_tonnes_per_ha": round(float(r["yield_tonnes_per_ha"]), 3),
            "rainfall_mm": round(float(r["rainfall_mm"]), 1),
            "is_demo": bool(r["is_demo"])
        })

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }

def get_export_rows(
    state: Optional[str] = None,
    district: Optional[str] = None,
    crop: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    season: Optional[str] = None,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    where_clause, params = build_filter_clauses(state, district, crop, year_start, year_end, season, search)
    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"""
        SELECT 
            id, state, district, crop, crop_year, season,
            area_hectares, production_tonnes, rainfall_mm,
            CASE WHEN area_hectares > 0 THEN ROUND(production_tonnes / area_hectares, 3) ELSE 0.0 END AS yield_tonnes_per_ha,
            is_demo
        FROM crop_production
        WHERE {where_clause}
        ORDER BY crop_year DESC, state ASC, crop ASC
    """
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "state": r["state"],
            "district": r["district"],
            "crop": r["crop"],
            "crop_year": r["crop_year"],
            "season": r["season"],
            "area_hectares": r["area_hectares"],
            "production_tonnes": r["production_tonnes"],
            "yield_tonnes_per_ha": r["yield_tonnes_per_ha"],
            "rainfall_mm": r["rainfall_mm"],
            "data_source": "DEMO DATASET (Simulated)" if r["is_demo"] else "Verified User Upload"
        })
    return results
