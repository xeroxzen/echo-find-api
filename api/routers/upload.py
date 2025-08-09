from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from api.models.upload import UploadResponse
from api.services.upload_service import UploadService
from api.config import settings

router = APIRouter(redirect_slashes=False)
upload_service = UploadService()

@router.post("/", response_model=UploadResponse)
@router.post("", response_model=UploadResponse)
async def upload_audio_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Upload an audio file for transcription and indexing."""
    
    # Validate file format
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in settings.allowed_audio_formats + settings.allowed_video_formats:
        raise HTTPException(
            status_code=400, 
            detail=(
                "Unsupported file format. Allowed formats: "
                f"Audio[{', '.join(settings.allowed_audio_formats)}], "
                f"Video[{', '.join(settings.allowed_video_formats)}]"
            )
        )
    
    # Validate file size
    if hasattr(file, 'size') and file.size > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {settings.max_file_size / (1024*1024):.0f}MB"
        )
    
    try:
        result = await upload_service.process_upload(file, background_tasks)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{file_id}")
async def get_upload_status(file_id: str):
    """Get the processing status of an uploaded file."""
    try:
        status = await upload_service.get_upload_status(file_id)
        return status
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")
