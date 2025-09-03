from sqlalchemy.orm import Session
from api.db.database import get_db, AudioFile as DBAudioFile, Transcript as DBTranscript
from api.models.upload import AudioFile
from api.models.search import SearchResult
from typing import List, Optional
from datetime import datetime
import os

class DatabaseService:
    def __init__(self):
        pass
    
    async def create_audio_file(self, audio_file: AudioFile) -> bool:
        """Create a new audio file record in the database."""
        try:
            db = next(get_db())
            db_audio_file = DBAudioFile(
                id=audio_file.id,
                filename=audio_file.filename,
                file_size=audio_file.file_size,
                duration=audio_file.duration,
                format=audio_file.format,
                upload_time=audio_file.upload_time,
                transcription_status=audio_file.transcription_status,
                file_path=f"./uploads/{audio_file.id}.{audio_file.format}"
            )
            db.add(db_audio_file)
            db.commit()
            db.refresh(db_audio_file)
            return True
        except Exception as e:
            print(f"Error creating audio file record: {e}")
            return False
        finally:
            db.close()
    
    async def get_audio_file(self, file_id: str) -> Optional[DBAudioFile]:
        """Get an audio file record by ID."""
        try:
            db = next(get_db())
            return db.query(DBAudioFile).filter(DBAudioFile.id == file_id).first()
        except Exception as e:
            print(f"Error getting audio file: {e}")
            return None
        finally:
            db.close()
    
    async def update_transcription_status(self, file_id: str, status: str) -> bool:
        """Update the transcription status of an audio file."""
        try:
            db = next(get_db())
            audio_file = db.query(DBAudioFile).filter(DBAudioFile.id == file_id).first()
            if audio_file:
                audio_file.transcription_status = status
                db.commit()
                return True
            return False
        except Exception as e:
            print(f"Error updating transcription status: {e}")
            return False
        finally:
            db.close()
    
    async def create_transcript_segment(self, file_id: str, segment_index: int, 
                                      start_time: float, end_time: float, 
                                      text: str, confidence_score: float) -> bool:
        """Create a transcript segment record."""
        try:
            db = next(get_db())
            transcript = DBTranscript(
                file_id=file_id,
                segment_index=segment_index,
                start_time=start_time,
                end_time=end_time,
                text=text,
                confidence_score=confidence_score,
                created_at=datetime.utcnow()
            )
            db.add(transcript)
            db.commit()
            return True
        except Exception as e:
            print(f"Error creating transcript segment: {e}")
            return False
        finally:
            db.close()
    
    async def search_transcripts(self, query: str, limit: int = 10, offset: int = 0) -> List[SearchResult]:
        """Search through transcript segments."""
        try:
            db = next(get_db())
            # Simple text search for now - can be enhanced with full-text search
            results = db.query(DBTranscript, DBAudioFile).join(
                DBAudioFile, DBTranscript.file_id == DBAudioFile.id
            ).filter(
                DBTranscript.text.ilike(f"%{query}%")
            ).limit(limit).offset(offset).all()
            
            search_results = []
            for transcript, audio_file in results:
                search_results.append(SearchResult(
                    file_id=transcript.file_id,
                    filename=audio_file.filename,
                    transcript_segment=transcript.text,
                    start_time=transcript.start_time,
                    end_time=transcript.end_time,
                    confidence_score=transcript.confidence_score or 0.0,
                    upload_time=audio_file.upload_time
                ))
            
            return search_results
        except Exception as e:
            print(f"Error searching transcripts: {e}")
            return []
        finally:
            db.close()
    
    async def get_all_files(self) -> List[DBAudioFile]:
        """Get all audio files."""
        try:
            db = next(get_db())
            return db.query(DBAudioFile).all()
        except Exception as e:
            print(f"Error getting all files: {e}")
            return []
        finally:
            db.close()
    
    async def delete_file(self, file_id: str) -> bool:
        """Delete a file and all associated data."""
        try:
            db = next(get_db())
            # Delete transcript segments first
            db.query(DBTranscript).filter(DBTranscript.file_id == file_id).delete()
            # Delete audio file record
            db.query(DBAudioFile).filter(DBAudioFile.id == file_id).delete()
            db.commit()
            return True
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False
        finally:
            db.close()
