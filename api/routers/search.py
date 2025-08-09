from fastapi import APIRouter, HTTPException, Query
from api.models.search import SearchRequest, SearchResponse
from api.services.search_service import SearchService
from typing import Optional, List
from datetime import datetime

router = APIRouter()
search_service = SearchService()

@router.post("/", response_model=SearchResponse)
async def search_audio_content(search_request: SearchRequest):
    """Search through transcribed audio content."""
    try:
        results = await search_service.search(search_request)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=SearchResponse)
async def search_audio_content_get(
    query: str = Query(..., description="Search query"),
    limit: int = Query(10, ge=1, le=100, description="Number of results to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    file_ids: Optional[str] = Query(None, description="Comma-separated file IDs to search within"),
    date_from: Optional[datetime] = Query(None, description="Search from this date"),
    date_to: Optional[datetime] = Query(None, description="Search to this date")
):
    """Search through transcribed audio content using GET parameters."""
    
    file_ids_list = None
    if file_ids:
        file_ids_list = [id.strip() for id in file_ids.split(",")]
    
    search_request = SearchRequest(
        query=query,
        limit=limit,
        offset=offset,
        file_ids=file_ids_list,
        date_from=date_from,
        date_to=date_to
    )
    
    try:
        results = await search_service.search(search_request)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
