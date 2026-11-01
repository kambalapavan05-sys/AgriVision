# AgriVision – Agricultural Crop Production Analysis System

AgriVision is an enterprise-grade, responsive full-stack agricultural intelligence dashboard engineered to monitor, filter, and analyze crop production, cultivated area, aggregate yield, and climatic precipitation indicators across regions and years.

Built with a high-contrast **dark emerald & forest** agronomic aesthetic, modern typography, interactive charts, and strict scientific data handling rules.

---

## 🌾 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Axios
- **Backend**: Python 3.14+, FastAPI, Pandas, SQLite 3, Uvicorn
- **Architecture**: Decoupled RESTful API with SQLite indexing, client-side caching, and responsive glassmorphism UI

---

## 🌟 Key Features

1. **Executive Overview Dashboard**: Real-time KPI summaries for total production, cultivated land acreage, aggregate yield, and mean rainfall.
2. **Cascading Filters**: Dynamically cascades State $\rightarrow$ District, Crop, Season (Kharif, Rabi, Zaid, Whole Year), and Harvest Year Range (2000–2023).
3. **Historical Trajectory Models**: Composed multi-series charts displaying production (MT), cultivated area (Ha), aggregate yield progression, and rainfall overlays.
4. **State-Wise & Crop-Wise Rankings**: Horizontal comparative ranking of top agricultural states and donut breakdown of crop production shares.
5. **Rainfall vs. Agronomic Output Correlation**:
   - Scatter plot correlating annual precipitation with district yields.
   - Computes real-time Pearson correlation coefficient ($r$).
   - **Prominent Non-Causality Disclaimer**: Explicitly informs users that rainfall is an observational metric and correlation does not imply direct causality.
6. **Dataset Explorer & Microdata Table**:
   - Full text search across state, district, crop, and year.
   - Multi-column ascending/descending sorting.
   - Dynamic page sizing (10, 15, 25, 50, 100 rows per page) and pagination.
   - Direct CSV export of active filtered view.
7. **CSV Dataset Ingestion & Validation**:
   - Drag-and-drop file upload.
   - Pre-validation engine verifying required headers (`state`, `district`, `crop`, `crop_year`, `season`, `area_hectares`, `production_tonnes`, `rainfall_mm`).
   - Line-by-line validation catching negative values, non-numeric strings, and missing fields.
   - Downloadable standardized sample CSV template.
   - Instant database ingestion with live record count update.
8. **Printable Executive Summary Report**: Formatted print/PDF-ready modal with scope filters, key metrics, and top-ranking states.
9. **Zero-Result Resilience**: Graceful empty states when filter combinations yield zero records.

---

## 📐 Data Governance & Integrity Rules

- **Transparent Labeling**: The initial dataset is clearly badged and labeled as `DEMO DATASET – Synthetic Historical Agricultural Metrics (2000-2023)`. User-uploaded datasets are distinguished with an `Uploaded` badge.
- **Consistent Agronomic Units**:
  - Production: Metric Tonnes (**MT**)
  - Cultivated Area: Hectares (**Ha**)
  - Aggregate Yield: Metric Tonnes per Hectare (**MT/Ha**)
  - Precipitation: Millimeters (**mm**)
- **Aggregate Yield Calculation**:
  $$\text{Aggregate Yield} = \frac{\sum \text{Production (MT)}}{\sum \text{Cultivated Area (Ha)}}$$
  Calculations never take the unweighted mean of individual row yields. Division-by-zero is safely handled with `0.00 MT/Ha`.
- **Agronomic Disclaimer**: The platform explicitly warns against inferring causation or making unsupported farm management decisions solely from rainfall statistics.

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js (v18+) and npm (v9+)
- Python (v3.10+)

### 1. Backend Setup & Run

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1
# On Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run automated tests
python -m pytest -v tests/test_api.py

# Launch FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend starts at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup & Run

```bash
cd frontend

# Install npm dependencies
npm install

# Build for production
npm run build

# Launch Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```

The frontend will be accessible at `http://127.0.0.1:5173`. All `/api` requests are automatically proxied to the backend on port 8000.

---

## 🧪 Testing Summary

- **Backend API Tests**: 11 automated pytest integration test cases covering:
  - Database auto-seeding
  - Cascading metadata endpoints
  - Aggregate yield formula validation ($\sum \text{prod} / \sum \text{area}$)
  - Zero-area handling
  - Trend generation & sorting
  - State & crop share aggregations
  - Pearson $r$ correlation and disclaimer verification
  - Paginated table search and sorting
  - CSV schema validator and sample template download
  - CSV & JSON filtered exports
- **Frontend Build**: Production build validated with Vite and Tailwind CSS.
