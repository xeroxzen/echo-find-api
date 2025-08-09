from fastapi import APIRouter, HTTPException
from api.services.admin_service import AdminService
from typing import List

router = APIRouter()
admin_service = AdminService()

@router.get("/files")
async def list_files():
    """List all uploaded files with their metadata."""
    try:
        files = await admin_service.list_all_files()
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    """Delete a file and all associated data."""
    try:
        result = await admin_service.delete_file(file_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reindex")
async def reindex_all():
    """Reindex all transcripts in the search engine."""
    try:
        result = await admin_service.reindex_all_transcripts()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_system_stats():
    """Get system statistics and health information."""
    try:
        stats = await admin_service.get_system_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cleanup")
async def cleanup_orphaned_files():
    """Clean up orphaned files and stale data."""
    try:
        result = await admin_service.cleanup_orphaned_files()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
