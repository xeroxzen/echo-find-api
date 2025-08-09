from api.models.playback import PlaybackRequest, PlaybackResponse
from api.config import settings
import os
from typing import AsyncGenerator, Optional

class PlaybackService:
    def __init__(self):
        self.storage_path = settings.local_storage_path
    
    async def get_playback_info(self, request: PlaybackRequest) -> PlaybackResponse:
        """Get playback information for an audio file or segment."""
        try:
            # TODO: Get file info from database
            # For now, just check if file exists
            file_path = self._get_file_path(request.file_id)
            
            if not os.path.exists(file_path):
                return PlaybackResponse(
                    success=False,
                    file_id=request.file_id,
                    message="Audio file not found"
                )
            
            # Generate playback URL (in production, this might be a signed URL)
            audio_url = f"/api/v1/playback/{request.file_id}"
            
            return PlaybackResponse(
                success=True,
                audio_url=audio_url,
                file_id=request.file_id,
                start_time=request.start_time,
                end_time=request.end_time,
                message="Playback info retrieved successfully"
            )
            
        except Exception as e:
            return PlaybackResponse(
                success=False,
                file_id=request.file_id,
                message=f"Error retrieving playback info: {str(e)}"
            )
    
    async def stream_audio(
        self,
        file_id: str,
        start_time: Optional[float] = None,
        end_time: Optional[float] = None,
    ) -> AsyncGenerator[bytes, None]:
        """Stream audio file or segment."""
        file_path = self._get_file_path(file_id)
        
        if not os.path.exists(file_path):
            raise FileNotFoundError("Audio file not found")
        
        # TODO: Implement audio segmentation if start_time/end_time provided
        # For now, just stream the entire file
        
        chunk_size = 8192
        with open(file_path, 'rb') as audio_file:
            while True:
                chunk = audio_file.read(chunk_size)
                if not chunk:
                    break
                yield chunk
    
    async def get_audio_info(self, file_id: str) -> dict:
        """Get audio file information and metadata."""
        try:
            file_path = self._get_file_path(file_id)
            
            if not os.path.exists(file_path):
                raise FileNotFoundError("Audio file not found")
            
            # TODO: Get metadata from database and audio file analysis
            file_stat = os.stat(file_path)
            
            return {
                "file_id": file_id,
                "file_size": file_stat.st_size,
                "created_at": file_stat.st_ctime,
                "format": file_path.split('.')[-1],
                # TODO: Add duration, bitrate, etc. from audio analysis
            }
            
        except Exception as e:
            raise Exception(f"Error getting audio info: {str(e)}")
    
    async def get_transcript(self, file_id: str) -> dict:
        """Return transcript text for a given file.

        I return a simple placeholder if no sidecar transcript file is found.
        If a sidecar file named `{file_id}.txt` exists alongside the audio in
        the storage path, I will return its contents as the transcript.
        """
        try:
            # Try to find a sidecar transcript file
            transcript_path = os.path.join(self.storage_path, f"{file_id}.txt")
            if os.path.exists(transcript_path):
                with open(transcript_path, "r", encoding="utf-8") as f:
                    content = f.read()
                return {"file_id": file_id, "transcript": content}

            # Fallback placeholder text until transcription pipeline is wired
            placeholder = (
                "This is a placeholder transcript. The transcription pipeline "
                "is not yet connected. Once processing completes, this will "
                "display the full text of the audio."
            )
            return {"file_id": file_id, "transcript": placeholder}

        except Exception as exc:
            raise Exception(f"Error getting transcript: {str(exc)}")

    def _get_file_path(self, file_id: str) -> str:
        """Get the file path for a given file ID."""
        # TODO: This should query the database to get the actual filename
        # For now, assume files are stored as {file_id}.{extension}
        for ext in settings.allowed_audio_formats:
            potential_path = os.path.join(self.storage_path, f"{file_id}.{ext}")
            if os.path.exists(potential_path):
                return potential_path
        
        # Fallback to mp3 if not found
        return os.path.join(self.storage_path, f"{file_id}.mp3")

    async def get_original_media_path(self, file_id: str) -> str:
        """Return the path to the stored original media (audio or video)."""
        # Try audio first
        for ext in settings.allowed_audio_formats + settings.allowed_video_formats:
            potential_path = os.path.join(self.storage_path, f"{file_id}.{ext}")
            if os.path.exists(potential_path):
                return potential_path
        # If still not found, raise
        raise FileNotFoundError("Media file not found")
