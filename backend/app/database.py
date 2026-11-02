import os
import re
from pathlib import Path

import psycopg
from dotenv import load_dotenv

load_dotenv()

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


class Row(tuple):
    """Supports both row[0] and row["name"], like sqlite3.Row."""
    def __new__(cls, cols, values):
        obj = super().__new__(cls, values)
        obj._cols = list(cols)
        return obj

    def __getitem__(self, key):
        if isinstance(key, str):
            try:
                return tuple.__getitem__(self, self._cols.index(key))
            except ValueError:
                raise KeyError(key)
        return tuple.__getitem__(self, key)

    def get(self, key, default=None):
        if isinstance(key, str) and key in self._cols:
            return tuple.__getitem__(self, self._cols.index(key))
        return default

    def keys(self):
        return list(self._cols)

    def __contains__(self, key):
        return key in self._cols


def _row_factory(cursor):
    cols = [c.name for c in cursor.description] if cursor.description else []
    return lambda values: Row(cols, values)


_NAMED = re.compile(r"(?<!:):([A-Za-z_]\w*)")


def _convert(sql: str, has_params: bool) -> str:
    """Convert SQLite-style placeholders (:name and ?) to psycopg style."""
    if not has_params:
        return sql
    sql = sql.replace("%", "%%")
    sql = sql.replace("?", "%s")
    return _NAMED.sub(r"%(\1)s", sql)


class _Cursor:
    def __init__(self, cur):
        self._cur = cur

    def execute(self, sql, params=None):
        self._cur.execute(_convert(sql, params is not None), params)
        return self

    def executemany(self, sql, seq):
        self._cur.executemany(_convert(sql, True), seq)
        return self

    def fetchone(self):
        return self._cur.fetchone()

    def fetchall(self):
        return self._cur.fetchall()

    def __iter__(self):
        return iter(self._cur)

    @property
    def rowcount(self):
        return self._cur.rowcount


class _Connection:
    def __init__(self, conn):
        self._conn = conn

    def cursor(self):
        return _Cursor(self._conn.cursor())

    def execute(self, sql, params=None):
        return self.cursor().execute(sql, params)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type:
            self._conn.rollback()
        else:
            self._conn.commit()


def get_db_connection() -> _Connection:
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL is not set. Add it to backend/.env")
    conn = psycopg.connect(
        url,
        row_factory=_row_factory,
        prepare_threshold=None,  # needed for Neon's pooled connection
        connect_timeout=10,
    )
    return _Connection(conn)


def init_db() -> None:
    """Create tables and indexes in Postgres."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS crop_production (
            id SERIAL PRIMARY KEY,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            crop TEXT NOT NULL,
            crop_year INTEGER NOT NULL,
            season TEXT NOT NULL,
            area_hectares DOUBLE PRECISION NOT NULL,
            production_tonnes DOUBLE PRECISION NOT NULL,
            rainfall_mm DOUBLE PRECISION NOT NULL,
            is_demo INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # case-insensitive unique email (replaces SQLite's COLLATE NOCASE)
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email))")

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_crop_state_year ON crop_production (crop, state, crop_year)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_state_district ON crop_production (state, district)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_crop_year ON crop_production (crop_year)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_season ON crop_production (season)")

    conn.commit()
    conn.close()