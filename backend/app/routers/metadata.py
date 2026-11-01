from fastapi import APIRouter
from app.crud import get_filter_options
from app.models import FilterOptionsResponse

router = APIRouter(prefix="/api/metadata", tags=["Metadata"])

@router.get("/filters", response_model=FilterOptionsResponse)
def get_filters():
    """Retrieve distinct states, districts-by-state, crops, seasons, and year ranges."""
    data = get_filter_options()
    return data
