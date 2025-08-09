from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SearchRequest(BaseModel):
    query: str
    limit: int = 10
    offset: int = 0
    file_ids: Optional[List[str]] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None

class SearchResult(BaseModel):
    file_id: str
    filename: str
    transcript_segment: str
    start_time: float
    end_time: float
    confidence_score: float
    upload_time: datetime

class SearchResponse(BaseModel):
    success: bool
    results: List[SearchResult]
    total_count: int
    query: str
    took_ms: int
