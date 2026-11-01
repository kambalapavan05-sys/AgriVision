from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import init_db, get_db_connection
from app.data_loader import seed_demo_data_if_empty
from app.routers import metadata, analytics, records, upload, auth

# Load environment variables
load_dotenv()


# Initialize database and demo data
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables and indexes
    init_db()
    # Seed high-fidelity DEMO dataset if database is empty
    count = seed_demo_data_if_empty()
    print(f"[AgriVision] Initialized SQLite database with {count} records.")
    yield


# Create FastAPI application
app = FastAPI(
    title="AgriVision API",
    description="Agricultural Crop Production Analysis and Agronomic Intelligence API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(metadata.router)
app.include_router(analytics.router)
app.include_router(records.router)
app.include_router(upload.router)
app.include_router(auth.router)


@app.get("/")
def root():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM crop_production")
    count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM crop_production WHERE is_demo = 1")
    demo_count = cursor.fetchone()[0]
    conn.close()

    return {
        "system": "AgriVision – Agricultural Crop Production Analysis System",
        "status": "online",
        "version": "1.0.0",
        "total_records": count,
        "demo_records": demo_count,
        "dataset_notice": (
            "DEMO DATASET – Simulated historical agricultural metrics "
            "(2000-2023). For demonstration & analytical use only."
        )
    }
