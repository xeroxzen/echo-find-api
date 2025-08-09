from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AudioFile(BaseModel):
    id: str
    filename: str
    file_size: int
    duration: Optional[float] = None
    format: str
    upload_time: datetime
    transcription_status: str = "pending"  # pending, processing, completed, failed
    
class UploadResponse(BaseModel):
    success: bool
    message: str
    file_id: Optional[str] = None
    audio_file: Optional[AudioFile] = None
