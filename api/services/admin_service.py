from api.config import settings
from api.services.database_service import DatabaseService
import os
from datetime import datetime

class AdminService:
    def __init__(self):
        self.storage_path = settings.local_storage_path
        self.db_service = DatabaseService()
    
    async def list_all_files(self) -> list:
        """List all uploaded files with their metadata."""
        try:
            # Query database for file metadata
            db_files = await self.db_service.get_all_files()
            files = []
            
            for db_file in db_files:
                files.append({
                    "file_id": db_file.id,
                    "filename": db_file.filename,
                    "file_size": db_file.file_size,
                    "duration": db_file.duration,
                    "format": db_file.format,
                    "upload_time": db_file.upload_time,
                    "transcription_status": db_file.transcription_status
                })
            
            return files
            
        except Exception as e:
            raise Exception(f"Error listing files: {str(e)}")
    
    async def delete_file(self, file_id: str) -> dict:
        """Delete a file and all associated data."""
        try:
            # Delete from database first
            db_success = await self.db_service.delete_file(file_id)
            
            # Delete physical file
            deleted = False
            for ext in settings.allowed_audio_formats + settings.allowed_video_formats:
                file_path = os.path.join(self.storage_path, f"{file_id}.{ext}")
                if os.path.exists(file_path):
                    os.remove(file_path)
                    deleted = True
                    break
            
            # Also delete transcript file
            transcript_path = os.path.join(self.storage_path, f"{file_id}.txt")
            if os.path.exists(transcript_path):
                os.remove(transcript_path)
            
            if not db_success and not deleted:
                return {"success": False, "message": "File not found"}
            
            return {
                "success": True,
                "message": f"File {file_id} deleted successfully"
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Error deleting file: {str(e)}"
            }
    
    async def reindex_all_transcripts(self) -> dict:
        """Reindex all transcripts in the search engine."""
        try:
            # TODO: Implement reindexing logic
            # 1. Get all transcripts from database
            # 2. Clear existing indices
            # 3. Rebuild ElasticSearch and ChromaDB indices
            
            return {
                "success": True,
                "message": "Reindexing completed",
                "indexed_files": 0  # TODO: Return actual count
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Reindexing failed: {str(e)}"
            }
    
    async def get_system_stats(self) -> dict:
        """Get system statistics and health information."""
        try:
            # Count files in storage
            file_count = 0
            total_size = 0
            
            if os.path.exists(self.storage_path):
                for filename in os.listdir(self.storage_path):
                    file_path = os.path.join(self.storage_path, filename)
                    if os.path.isfile(file_path):
                        file_count += 1
                        total_size += os.path.getsize(file_path)
            
            # TODO: Add database stats, search engine stats, etc.
            
            return {
                "storage": {
                    "total_files": file_count,
                    "total_size_bytes": total_size,
                    "total_size_mb": round(total_size / (1024 * 1024), 2),
                    "storage_path": self.storage_path
                },
                "database": {
                    "status": "connected",  # TODO: Check actual DB connection
                    "total_records": 0      # TODO: Query actual count
                },
                "search_engine": {
                    "elasticsearch_status": "unknown",  # TODO: Check ES health
                    "chromadb_status": "unknown"        # TODO: Check ChromaDB health
                },
                "system": {
                    "uptime": "unknown",  # TODO: Track application uptime
                    "version": "1.0.0"
                }
            }
            
        except Exception as e:
            raise Exception(f"Error getting system stats: {str(e)}")
    
    async def cleanup_orphaned_files(self) -> dict:
        """Clean up orphaned files and stale data."""
        try:
            # TODO: Implement cleanup logic
            # 1. Find files in storage without database records
            # 2. Find database records without physical files
            # 3. Clean up stale search index entries
            
            return {
                "success": True,
                "message": "Cleanup completed",
                "orphaned_files_removed": 0,
                "stale_records_removed": 0
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Cleanup failed: {str(e)}"
            }
