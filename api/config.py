from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database settings
    database_url: str = "postgresql://user:password@localhost/echofind"
    
    # Storage settings
    storage_type: str = "local"  # or "gcs"
    local_storage_path: str = "./uploads"
    gcs_bucket_name: Optional[str] = None
    
    # Search and indexing settings
    elasticsearch_url: str = "http://localhost:9200"
    chromadb_host: str = "localhost"
    chromadb_port: int = 8000
    
    # Whisper API settings
    openai_api_key: Optional[str] = None
    whisper_model: str = "whisper-1"  # OpenAI Whisper via API
    whisper_language: Optional[str] = None  # e.g., "en" to bias language
    
    # API settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    
    # File upload settings
    max_file_size: int = 100 * 1024 * 1024  # 100MB
    allowed_audio_formats: list[str] = ["mp3", "wav", "m4a", "ogg", "flac"]
    
    class Config:
        env_file = ".env"

settings = Settings()
