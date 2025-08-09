from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from api.models.playback import PlaybackRequest, PlaybackResponse
from api.services.playback_service import PlaybackService

router = APIRouter()
playback_service = PlaybackService()

@router.post("/", response_model=PlaybackResponse)
async def get_playback_info(playback_request: PlaybackRequest):
    """Get playback information for an audio file or segment."""
    try:
        result = await playback_service.get_playback_info(playback_request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{file_id}")
async def stream_audio(file_id: str, start_time: float = None, end_time: float = None):
    """Stream audio file or segment."""
    try:
        audio_stream = await playback_service.stream_audio(file_id, start_time, end_time)
        return StreamingResponse(
            audio_stream,
            media_type="audio/mpeg",
            headers={"Content-Disposition": f"attachment; filename=\"{file_id}.mp3\""}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail="Audio file not found")

@router.get("/{file_id}/info")
async def get_audio_info(file_id: str):
    """Get audio file information and metadata."""
    try:
        info = await playback_service.get_audio_info(file_id)
        return info
    except Exception as e:
        raise HTTPException(status_code=404, detail="Audio file not found")
