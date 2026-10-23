import io
from fastapi import APIRouter, File, HTTPException, Response, UploadFile
from app.crud import get_db_connection
from app.data_loader import commit_validated_rows, validate_csv_content
from app.models import UploadCommitResponse, UploadValidationResponse

router = APIRouter(prefix="/api/upload", tags=["Upload"])

@router.post("/validate", response_model=UploadValidationResponse)
async def validate_csv(file: UploadFile = File(...)):
    """
    Validates uploaded CSV file schema and row data without persisting.
    Returns row count, errors list, and sample preview with calculated yield.
    """
    if not file.filename.endswith((".csv", ".txt")):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are supported.")

    content_bytes = await file.read()
    try:
        content_text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            content_text = content_bytes.decode("latin-1")
        except Exception:
            raise HTTPException(status_code=400, detail="Unable to decode file. Please ensure it is saved in UTF-8 encoding.")

    result = validate_csv_content(content_text)
    return UploadValidationResponse(
        valid=result["valid"],
        total_rows=result["total_rows"],
        valid_rows_count=result["valid_rows_count"],
        invalid_rows_count=result["invalid_rows_count"],
        errors=result["errors"],
        preview=result["preview"],
        dataset_name=file.filename
    )

@router.post("/commit", response_model=UploadCommitResponse)
async def commit_csv(file: UploadFile = File(...)):
    """
    Validates and ingests valid records from uploaded CSV into the SQLite database.
    """
    if not file.filename.endswith((".csv", ".txt")):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are supported.")

    content_bytes = await file.read()
    try:
        content_text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        content_text = content_bytes.decode("latin-1")

    result = validate_csv_content(content_text)
    if not result["valid_rows"]:
        raise HTTPException(status_code=400, detail="No valid rows found in the uploaded file.")

    inserted_count = commit_validated_rows(result["valid_rows"])

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM crop_production")
    total_db_records = cursor.fetchone()[0]
    conn.close()

    return UploadCommitResponse(
        message=f"Successfully ingested {inserted_count} agricultural records.",
        rows_inserted=inserted_count,
        total_db_records=total_db_records
    )

@router.get("/sample")
def download_sample_template():
    """
    Provides a standardized sample CSV template for users to populate and upload.
    """
    sample_content = (
        "state,district,crop,crop_year,season,area_hectares,production_tonnes,rainfall_mm\n"
        "Punjab,Ludhiana,Wheat,2023,Rabi,45000,215000,580.5\n"
        "Maharashtra,Nashik,Sugarcane,2023,Whole Year,28000,2240000,890.0\n"
        "Andhra Pradesh,Guntur,Cotton,2023,Kharif,35000,31500,920.4\n"
        "West Bengal,Burdwan,Rice,2023,Kharif,62000,248000,1320.0\n"
        "Madhya Pradesh,Indore,Soybean,2023,Kharif,41000,65600,1010.2\n"
    )
    return Response(
        content=sample_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=agrivision_sample_template.csv"}
    )
