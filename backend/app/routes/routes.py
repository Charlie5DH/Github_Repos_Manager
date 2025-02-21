import logging
from typing import List
import json

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text

from app.schemas.schemas import GitHubRepoSchema, NotificationPayload
from app.models.repository import Repository
from app.services.rabbitmq import publish_message
from app.db.database import get_db
from app.routes.ws_routes import router as ws_router, manager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)
QUEUE_NAME = "repos_import_queue"

router = APIRouter()
# Include the WebSocket routes under /ws
router.include_router(ws_router, prefix="/ws", tags=["websocket"])

@router.get("/health")
def healthcheck():
    return {"status": "ok"}

@router.get("/health/db")
def db_healthcheck(db: Session = Depends(get_db)):
    """
    Attempt a SELECT to ensure the database is responding.
    """
    try:
        db.execute(text("SELECT 1"))
        return {"db_status": "connected"}
    except Exception as e:
        logger.info(e)
        raise HTTPException(status_code=500, detail="Database not connected")

@router.post("/notify")
async def notify_all(payload: NotificationPayload):
    """
    Broadcast a message to all connected WebSocket clients.
    """
    data = payload.dict()
    serialized = json.dumps(data)
    await manager.broadcast(serialized)
    return {"detail": "Broadcast sent to all clients."}

@router.post("/import-repos")
async def import_repos(repos: List[GitHubRepoSchema], db: Session = Depends(get_db)):
    """
    Receives an array of GitHubRepo-like objects and sends them to a RabbitMQ queue
    for background processing (e.g., storing in the DB).
    """
    if not repos:
        raise HTTPException(status_code=400, detail="No repository data provided.")

    repos_to_import = []
    for r in repos:
        existing = db.query(Repository).filter(Repository.id == r.id).first()
        if existing:
            continue
        else:
            repos_to_import.append(r)

    if not repos_to_import:
        raise HTTPException(status_code=400,
                            detail="All provided repos already exist in the database.")

    # Serialize the list of repos to JSON
    payload = json.dumps([repo.dict() for repo in repos_to_import])

    # Publish to the RabbitMQ queue
    try:
        print("Publishing message to RabbitMQ")
        publish_message(QUEUE_NAME, payload)
    except Exception as e:
        logger.error("Failed to publish message to RabbitMQ: %s", e)
        raise HTTPException(status_code=500, detail="Failed to queue repositories for import.")

    return {"detail": "Repositories queued for import."}

@router.get("/repositories", response_model=List[GitHubRepoSchema])
def get_repositories(db: Session = Depends(get_db)):
    """
    Returns all repositories from the database.
    """
    repos = db.query(Repository).all()
    return repos


@router.delete("/repositories")
def delete_all_repositories(db: Session = Depends(get_db)):
    """
    Deletes all Repository records from the database.
    """
    try:
        db.query(Repository).delete()
        db.commit()
    except Exception as e:
        logger.error("Failed to delete repositories: %s", e)
        raise HTTPException(status_code=500, detail="Failed to delete repositories.")
    return {"detail": "All repositories deleted."}