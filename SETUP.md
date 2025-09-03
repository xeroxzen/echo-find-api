# EchoFind Setup Guide

## Overview

EchoFind is an AI-powered voice note search engine that transforms audio messages into searchable content using OpenAI Whisper and semantic search.

## Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- OpenAI API key

## Quick Start

### 1. Clone and Setup Backend

```bash
# Clone the repository
git clone <repository-url>
cd echo-find-api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb echofind
sudo -u postgres createuser --interactive

# Run database setup
python setup_database.py
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost/echofind

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
WHISPER_MODEL=whisper-1
WHISPER_LANGUAGE=en

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# Storage Configuration
STORAGE_TYPE=local
LOCAL_STORAGE_PATH=./uploads
```

### 4. Start Backend Server

```bash
python run.py
```

The API will be available at `http://localhost:8000`

### 5. Setup Frontend

```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Upload

- `POST /api/v1/upload/` - Upload audio file
- `GET /api/v1/upload/status/{file_id}` - Get upload status

### Search

- `POST /api/v1/search/` - Search transcripts
- `GET /api/v1/search/` - Search with query parameters

### Playback

- `GET /api/v1/playback/{file_id}` - Stream audio
- `GET /api/v1/playback/{file_id}/transcript` - Get transcript
- `GET /api/v1/playback/{file_id}/info` - Get file info

### Admin

- `GET /api/v1/admin/files` - List all files
- `DELETE /api/v1/admin/files/{file_id}` - Delete file
- `GET /api/v1/admin/stats` - System statistics

## Features

### ✅ Implemented

- Audio file upload and storage
- OpenAI Whisper transcription
- Basic search functionality
- Audio playback and streaming
- Database integration
- Modern web interface
- File management

### 🚧 In Progress

- Advanced search with ElasticSearch
- Vector similarity search with ChromaDB
- Real-time transcription status updates
- Audio segmentation and timestamp navigation

### 📋 Planned

- User authentication and authorization
- Multi-tenant support
- Advanced analytics
- API rate limiting
- Background job processing with Celery
- Cloud storage integration (GCS, S3)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI    │    │   FastAPI       │    │   PostgreSQL    │
│   (Port 3000)   │◄──►│   (Port 8000)   │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   OpenAI        │
                       │   Whisper API   │
                       └─────────────────┘
```

## Development

### Running Tests

```bash
# Backend tests
pytest

# Frontend tests
cd client
npm test
```

### Code Quality

```bash
# Backend linting
flake8 api/
black api/

# Frontend linting
cd client
npm run lint
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **OpenAI API Errors**

   - Verify OPENAI_API_KEY is set
   - Check API key has sufficient credits
   - Ensure network connectivity

3. **File Upload Issues**

   - Check uploads directory permissions
   - Verify file size limits
   - Ensure supported file formats

4. **CORS Errors**
   - Check CORS configuration in api/main.py
   - Verify frontend URL matches allowed origins

### Logs

Backend logs are available in the terminal where you run `python run.py`

Frontend logs are available in the browser developer console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
