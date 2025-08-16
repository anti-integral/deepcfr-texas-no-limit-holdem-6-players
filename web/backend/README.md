# DeepCFR Web Backend

FastAPI backend to expose a minimal API for a browser UI to interact with the poker engine.

Notes:
- In-memory session store; state resets on restart (sufficient for demo).
- CORS enabled for local/dev frontends.

## Run locally
poetry install
poetry run fastapi dev app/main.py

## Deploy
Deployment is handled by Devin's fly.io wrapper. Ensure pyproject.toml lists dependencies.
