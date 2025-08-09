from pydantic import BaseModel
from typing import Optional

class PlaybackRequest(BaseModel):
    file_id: str
    start_time: Optional[float] = None
    end_time: Optional[float] = None

class PlaybackResponse(BaseModel):
    success: bool
    audio_url: Optional[str] = None
    file_id: str
    start_time: Optional[float] = None
    end_time: Optional[float] = None
    duration: Optional[float] = None
    message: Optional[str] = None
