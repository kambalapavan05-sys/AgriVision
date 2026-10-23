import csv
import io
import math
import random
from pathlib import Path
from typing import Dict, List, Tuple
from app.database import get_db_connection

DATA_DIR = Path(__file__).parent / "data"
DEMO_CSV_PATH = DATA_DIR / "demo_dataset.csv"

# Pre-defined agricultural knowledge graph for realistic synthesis
STATE_DISTRICTS = {
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Haryana": ["Karnal", "Ambala", "Hisar", "Rohtak", "Sirsa"],
    "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra", "Meerut", "Kanpur Nagar", "Bareilly"],
    "Maharashtra": ["Nashik", "Pune", "Aurangabad", "Nagpur", "Solapur", "Ahmednagar"],
    "Gujarat": ["Ahmedabad", "Rajkot", "Surat", "Vadodara", "Junagadh"],
    "Karnataka": ["Belagavi", "Dharwad", "Mysuru", "Mandya", "Vijayapura"],
    "Andhra Pradesh": ["Guntur", "Krishna", "Kurnool", "Visakhapatnam", "West Godavari"],
    "Madhya Pradesh": ["Indore", "Ujjain", "Bhopal", "Jabalpur", "Dewas"],
    "West Bengal": ["Burdwan", "Hooghly", "Nadia", "Murshidabad", "Bankura"],
    "Tamil Nadu": ["Thanjavur", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Sri Ganganagar", "Bikaner"]
}

# Crop base yield (MT/Ha) benchmarks & appropriate seasons
CROP_SPECS = {
    "Rice": {"seasons": ["Kharif", "Whole Year"], "base_yield": 3.4, "yield_var": 0.6, "rain_sens": 0.3},
    "Wheat": {"seasons": ["Rabi"], "base_yield": 4.1, "yield_var": 0.7, "rain_sens": 0.15},
    "Cotton": {"seasons": ["Kharif"], "base_yield": 0.9, "yield_var": 0.25, "rain_sens": 0.25},
    "Sugarcane": {"seasons": ["Whole Year"], "base_yield": 72.0, "yield_var": 12.0, "rain_sens": 0.2},
    "Maize": {"seasons": ["Kharif", "Rabi"], "base_yield": 2.8, "yield_var": 0.5, "rain_sens": 0.25},
    "Pulses": {"seasons": ["Kharif", "Rabi"], "base_yield": 0.85, "yield_var": 0.2, "rain_sens": 0.35},
    "Groundnut": {"seasons": ["Kharif"], "base_yield": 1.7, "yield_var": 0.4, "rain_sens": 0.3},
    "Soybean": {"seasons": ["Kharif"], "base_yield": 1.45, "yield_var": 0.35, "rain_sens": 0.3}
}

STATE_CROPS = {
    "Punjab": ["Wheat", "Rice", "Cotton", "Maize", "Sugarcane"],
    "Haryana": ["Wheat", "Rice", "Cotton", "Sugarcane", "Pulses"],
    "Uttar Pradesh": ["Wheat", "Rice", "Sugarcane", "Pulses", "Maize"],
    "Maharashtra": ["Sugarcane", "Cotton", "Soybean", "Pulses", "Groundnut"],
    "Gujarat": ["Cotton", "Groundnut", "Wheat", "Pulses", "Maize"],
    "Karnataka": ["Maize", "Sugarcane", "Rice", "Pulses", "Groundnut"],
    "Andhra Pradesh": ["Rice", "Cotton", "Groundnut", "Maize", "Pulses"],
    "Madhya Pradesh": ["Soybean", "Wheat", "Pulses", "Maize", "Rice"],
    "West Bengal": ["Rice", "Wheat", "Maize", "Pulses"],
    "Tamil Nadu": ["Rice", "Sugarcane", "Groundnut", "Pulses", "Cotton"],
    "Rajasthan": ["Wheat", "Pulses", "Groundnut", "Maize", "Soybean"]
}

# State baseline annual rainfall (mm)
STATE_RAINFALL = {
    "Punjab": 620,
    "Haryana": 560,
    "Uttar Pradesh": 880,
    "Maharashtra": 950,
    "Gujarat": 780,
    "Karnataka": 1050,
    "Andhra Pradesh": 920,
    "Madhya Pradesh": 1020,
    "West Bengal": 1450,
    "Tamil Nadu": 910,
    "Rajasthan": 480
}

def generate_demo_dataset_rows() -> List[Dict]:
    """
    Synthesize authentic-styled historical agricultural records from 2000-2023.
    Deterministic random seed ensures reproducible analytics for tests and demos.
    """
    rng = random.Random(42)
    rows = []

    for year in range(2000, 2024):
        # Climate shock index per year (e.g., 2002 drought, 2009 drought, 2019 wet year)
        climate_year_factor = 1.0
        if year in [2002, 2009, 2014, 2015]:
            climate_year_factor = 0.82  # Drought / deficit monsoon year
        elif year in [2010, 2019, 2020]:
            climate_year_factor = 1.15  # Surplus monsoon year

        # Tech progress trend (+0.9% yield increase per year)
        tech_factor = 1.0 + (year - 2000) * 0.009

        for state, districts in STATE_DISTRICTS.items():
            base_rain = STATE_RAINFALL.get(state, 800)
            available_crops = STATE_CROPS.get(state, ["Rice", "Wheat"])

            for district in districts:
                # District rainfall with variation around state baseline
                dist_rain_anomaly = rng.uniform(-0.15, 0.15)
                district_rainfall = round(base_rain * climate_year_factor * (1.0 + dist_rain_anomaly), 1)

                # Select 2 to 3 crops grown in this district
                chosen_crops = rng.sample(available_crops, min(3, len(available_crops)))

                for crop in chosen_crops:
                    spec = CROP_SPECS[crop]
                    season = rng.choice(spec["seasons"])

                    # Base cultivated area: 8,000 to 95,000 Hectares
                    area = round(rng.uniform(8500, 85000) * rng.uniform(0.9, 1.1), 1)

                    # State yield modifier (e.g. Punjab wheat/rice yield is higher due to tube-well irrigation)
                    state_yield_mod = 1.0
                    if state in ["Punjab", "Haryana"] and crop in ["Wheat", "Rice"]:
                        state_yield_mod = 1.35
                    elif state == "Maharashtra" and crop in ["Sugarcane", "Soybean"]:
                        state_yield_mod = 1.15
                    elif state == "Rajasthan" and crop in ["Pulses", "Wheat"]:
                        state_yield_mod = 0.85

                    # Yield calculation (MT/Ha)
                    base_y = spec["base_yield"] * state_yield_mod * tech_factor
                    # Mild rainfall influence (non-causal observation)
                    rain_ratio = district_rainfall / max(base_rain, 100)
                    weather_effect = 1.0 + (rain_ratio - 1.0) * spec["rain_sens"]
                    local_yield = max(0.2, rng.normalvariate(base_y * weather_effect, spec["yield_var"] * 0.4))
                    local_yield = round(local_yield, 3)

                    # Total Production in Metric Tonnes
                    production = round(area * local_yield, 2)

                    rows.append({
                        "state": state,
                        "district": district,
                        "crop": crop,
                        "crop_year": year,
                        "season": season,
                        "area_hectares": area,
                        "production_tonnes": production,
                        "rainfall_mm": district_rainfall,
                        "is_demo": 1
                    })

    # Add 2 edge cases for resilient handling (zero-area test case with 0 production)
    rows.append({
        "state": "Punjab",
        "district": "Ludhiana",
        "crop": "Pulses",
        "crop_year": 2023,
        "season": "Zaid",
        "area_hectares": 0.0,
        "production_tonnes": 0.0,
        "rainfall_mm": 610.0,
        "is_demo": 1
    })

    return rows

def ensure_demo_dataset_csv() -> Path:
    """Generate demo_dataset.csv on disk if not already present."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DEMO_CSV_PATH.exists():
        rows = generate_demo_dataset_rows()
        with open(DEMO_CSV_PATH, "w", newline="", encoding="utf-8") as f:
            fieldnames = [
                "state", "district", "crop", "crop_year", "season",
                "area_hectares", "production_tonnes", "rainfall_mm", "is_demo"
            ]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
    return DEMO_CSV_PATH

def seed_demo_data_if_empty() -> int:
    """Populate database with demo dataset if table is currently empty."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM crop_production")
    count = cursor.fetchone()[0]

    if count > 0:
        conn.close()
        return count

    ensure_demo_dataset_csv()
    rows = generate_demo_dataset_rows()

    cursor.executemany("""
        INSERT INTO crop_production (
            state, district, crop, crop_year, season,
            area_hectares, production_tonnes, rainfall_mm, is_demo
        ) VALUES (
            :state, :district, :crop, :crop_year, :season,
            :area_hectares, :production_tonnes, :rainfall_mm, :is_demo
        )
    """, rows)

    conn.commit()
    inserted_count = len(rows)
    conn.close()
    return inserted_count

HEADER_ALIASES = {
    "state": ["state", "state_name", "province"],
    "district": ["district", "district_name", "county"],
    "crop": ["crop", "crop_name", "commodity"],
    "crop_year": ["crop_year", "year", "harvest_year"],
    "season": ["season", "cropping_season"],
    "area_hectares": ["area_hectares", "area", "cultivated_area", "area_ha"],
    "production_tonnes": ["production_tonnes", "production", "total_production", "production_mt"],
    "rainfall_mm": ["rainfall_mm", "rainfall", "precipitation", "rain_mm"]
}

def map_column_header(header: str) -> str:
    cleaned = header.strip().lower().replace(" ", "_")
    for standard_col, aliases in HEADER_ALIASES.items():
        if cleaned in aliases:
            return standard_col
    return cleaned

def validate_csv_content(csv_text: str) -> Dict:
    """
    Validates CSV upload row-by-row.
    Returns:
      valid: bool
      errors: list of {row_number, field, message, value}
      preview: up to 10 parsed rows
      valid_rows: list of validated row dicts ready for insertion
    """
    f = io.StringIO(csv_text)
    reader = csv.reader(f)

    try:
        raw_headers = next(reader)
    except StopIteration:
        return {
            "valid": False,
            "total_rows": 0,
            "valid_rows_count": 0,
            "invalid_rows_count": 0,
            "errors": [{"row_number": 1, "field": "header", "message": "The CSV file is empty."}],
            "preview": [],
            "valid_rows": []
        }

    mapped_headers = [map_column_header(h) for h in raw_headers]
    required_cols = ["state", "district", "crop", "crop_year", "season", "area_hectares", "production_tonnes", "rainfall_mm"]
    missing_cols = [c for c in required_cols if c not in mapped_headers]

    if missing_cols:
        return {
            "valid": False,
            "total_rows": 0,
            "valid_rows_count": 0,
            "invalid_rows_count": 0,
            "errors": [{
                "row_number": 1,
                "field": "headers",
                "message": f"Missing required column headers: {', '.join(missing_cols)}. Recognized aliases include: {', '.join(required_cols)}"
            }],
            "preview": [],
            "valid_rows": []
        }

    header_indices = {mapped_headers[i]: i for i in range(len(mapped_headers))}

    errors = []
    valid_rows = []
    preview = []
    row_num = 1

    for row in reader:
        row_num += 1
        if not row or all(cell.strip() == "" for cell in row):
            continue  # skip blank lines

        row_errors = []
        parsed = {}

        # 1. State, District, Crop, Season (text checks)
        for text_col in ["state", "district", "crop", "season"]:
            idx = header_indices[text_col]
            val = row[idx].strip() if idx < len(row) else ""
            if not val:
                row_errors.append({"row_number": row_num, "field": text_col, "message": f"{text_col.title()} cannot be empty", "value": ""})
            else:
                parsed[text_col] = val.title()

        # 2. Crop Year (integer check)
        year_idx = header_indices["crop_year"]
        year_val = row[year_idx].strip() if year_idx < len(row) else ""
        try:
            year_int = int(float(year_val))
            if year_int < 1950 or year_int > 2100:
                row_errors.append({"row_number": row_num, "field": "crop_year", "message": "Year must be between 1950 and 2100", "value": year_val})
            else:
                parsed["crop_year"] = year_int
        except (ValueError, TypeError):
            row_errors.append({"row_number": row_num, "field": "crop_year", "message": "Crop Year must be a valid integer", "value": year_val})

        # 3. Numeric metrics: area_hectares, production_tonnes, rainfall_mm
        for num_col in ["area_hectares", "production_tonnes", "rainfall_mm"]:
            idx = header_indices[num_col]
            val = row[idx].strip() if idx < len(row) else ""
            try:
                num_float = float(val)
                if num_float < 0:
                    row_errors.append({"row_number": row_num, "field": num_col, "message": f"{num_col} cannot be negative", "value": val})
                elif math.isnan(num_float) or math.isinf(num_float):
                    row_errors.append({"row_number": row_num, "field": num_col, "message": f"{num_col} must be a finite number", "value": val})
                else:
                    parsed[num_col] = round(num_float, 2)
            except (ValueError, TypeError):
                row_errors.append({"row_number": row_num, "field": num_col, "message": f"{num_col} must be a valid number", "value": val})

        parsed["is_demo"] = 0  # User uploaded files are marked as user/non-synthetic

        if row_errors:
            errors.extend(row_errors)
        else:
            valid_rows.append(parsed)
            if len(preview) < 10:
                # Add calculated yield for preview
                preview_row = dict(parsed)
                area = preview_row.get("area_hectares", 0.0)
                prod = preview_row.get("production_tonnes", 0.0)
                preview_row["yield_tonnes_per_ha"] = round(prod / area, 3) if area > 0 else 0.0
                preview.append(preview_row)

    total_rows = len(valid_rows) + len(set(e["row_number"] for e in errors))
    is_valid = len(errors) == 0 and len(valid_rows) > 0

    return {
        "valid": is_valid,
        "total_rows": total_rows,
        "valid_rows_count": len(valid_rows),
        "invalid_rows_count": len(set(e["row_number"] for e in errors)),
        "errors": errors[:50],  # Return up to first 50 errors to prevent bloated payload
        "preview": preview,
        "valid_rows": valid_rows
    }

def commit_validated_rows(rows: List[Dict]) -> int:
    """Insert validated rows into database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.executemany("""
        INSERT INTO crop_production (
            state, district, crop, crop_year, season,
            area_hectares, production_tonnes, rainfall_mm, is_demo
        ) VALUES (
            :state, :district, :crop, :crop_year, :season,
            :area_hectares, :production_tonnes, :rainfall_mm, :is_demo
        )
    """, rows)
    conn.commit()
    inserted = len(rows)
    conn.close()
    return inserted
