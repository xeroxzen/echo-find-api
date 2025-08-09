from fastapi import UploadFile, BackgroundTasks
from api.models.upload import UploadResponse, AudioFile
from api.config import settings
import uuid
from datetime import datetime
import os
import aiofiles
from openai import OpenAI

class UploadService:
    def __init__(self):
        self.storage_path = settings.local_storage_path
        os.makedirs(self.storage_path, exist_ok=True)
    
    async def process_upload(self, file: UploadFile, background_tasks: BackgroundTasks | None = None) -> UploadResponse:
        """Process uploaded audio file."""
        try:
            # Generate unique file ID
            file_id = str(uuid.uuid4())
            file_extension = file.filename.split('.')[-1].lower()
            stored_filename = f"{file_id}.{file_extension}"
            file_path = os.path.join(self.storage_path, stored_filename)
            
            # Save file to storage
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            # Create audio file record
            audio_file = AudioFile(
                id=file_id,
                filename=file.filename,
                file_size=len(content),
                format=file_extension,
                upload_time=datetime.utcnow(),
                transcription_status="pending"
            )
            
            # Trigger async transcription job
            if background_tasks is not None:
                background_tasks.add_task(self._trigger_transcription, file_id, file_path)
            else:
                # Fallback: fire-and-forget (not ideal; prefer BackgroundTasks)
                await self._trigger_transcription(file_id, file_path)
            
            return UploadResponse(
                success=True,
                message="File uploaded successfully",
                file_id=file_id,
                audio_file=audio_file
            )
            
        except Exception as e:
            return UploadResponse(
                success=False,
                message=f"Upload failed: {str(e)}"
            )
    
    async def get_upload_status(self, file_id: str) -> dict:
        """Get the processing status of an uploaded file."""
        # TODO: Implement database lookup for file status
        return {
            "file_id": file_id,
            "status": "pending",  # This would come from database
            "message": "File is queued for processing"
        }
    
    async def _trigger_transcription(self, file_id: str, file_path: str):
        """Transcribe audio via Whisper API and store sidecar .txt transcript."""
        try:
            if not settings.openai_api_key:
                # No API key set; skip transcription but create placeholder
                transcript_path = os.path.join(self.storage_path, f"{file_id}.txt")
                async with aiofiles.open(transcript_path, "w", encoding="utf-8") as f:
                    await f.write(
                        "Transcription skipped: OPENAI_API_KEY not configured."
                    )
                return

            client = OpenAI(api_key=settings.openai_api_key)

            # Open file in binary for streaming to API
            # Note: open synchronously; upload handled by OpenAI client
            with open(file_path, "rb") as audio_file:
                transcription = client.audio.transcriptions.create(
                    model=settings.whisper_model,
                    file=audio_file,
                    language=settings.whisper_language,
                    response_format="text",
                )

            # Persist transcript to sidecar .txt next to audio
            transcript_text = transcription if isinstance(transcription, str) else str(transcription)
            transcript_path = os.path.join(self.storage_path, f"{file_id}.txt")
            async with aiofiles.open(transcript_path, "w", encoding="utf-8") as f:
                await f.write(transcript_text)

        except Exception as exc:
            # Persist error message for visibility in the UI
            transcript_path = os.path.join(self.storage_path, f"{file_id}.txt")
            async with aiofiles.open(transcript_path, "w", encoding="utf-8") as f:
                await f.write(f"Transcription failed: {str(exc)}")
