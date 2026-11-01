import sqlite3
from pathlib import Path
from typing import Generator

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / "agrivision.db"

def get_db_connection() -> sqlite3.Connection:
    """Return a connection with Row factory enabled for dictionary-like access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn

def init_db() -> None:
    """Initialize database tables and indexes."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS crop_production (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            crop TEXT NOT NULL,
            crop_year INTEGER NOT NULL,
            season TEXT NOT NULL,
            area_hectares REAL NOT NULL,
            production_tonnes REAL NOT NULL,
            rainfall_mm REAL NOT NULL,
            is_demo INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # User authentication table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL COLLATE NOCASE UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Performance indexes for aggregations and filtering
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_crop_state_year ON crop_production (crop, state, crop_year)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_state_district ON crop_production (state, district)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_crop_year ON crop_production (crop_year)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_season ON crop_production (season)")

    conn.commit()
    conn.close()
