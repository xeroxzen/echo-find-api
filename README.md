```bash
echofind/
│
├── client/                  # Next.js Web UI
│   └── ...                  # React components, pages, styles
│
├── cli/                     # Optional CLI tool for developers/users
│   └── ...                  # Python script(s) for uploading/searching via terminal
│
├── api/                     # FastAPI gateway (Upload, Search, Playback, Admin)
│   ├── main.py              # Entry point (FastAPI app)
│   ├── routers/             # Route handlers for different services
│   ├── services/            # Business logic (upload, search, playback)
│   ├── models/              # Pydantic models and schemas
│   ├── db/                  # DB access and logic
│   └── config.py            # App settings, environment variables
│
├── processing/              # Audio processing and transcription logic
│   ├── whisper_client.py    # Wrapper for Whisper API
│   ├── embeddings.py        # Vector generation from transcripts
│   ├── indexer.py           # Code to push into ElasticSearch + ChromaDB
│   └── utils.py             # Helpers for segmentation, cleaning, etc.
│
├── storage/                 # File storage handling
│   ├── local.py             # Local filesystem logic
│   ├── gcs.py               # Google Cloud Storage logic
│   └── base.py              # Interface definition for both
│
├── infra/                   # Infrastructure as code (for deployment)
│   ├── docker/              # Dockerfiles per service
│   ├── docker-compose.yml   # Compose stack (Postgres, ElasticSearch, ChromaDB, API)
│   └── terraform/           # GCP infra if needed later
│
├── docs/                    # Architecture, setup, diagrams
│   └── architecture.md
│
├── .env.example             # Environment variable template
├── README.md                # Project intro + setup guide
└── pyproject.toml           # Python project settings (shared dependencies)
```
