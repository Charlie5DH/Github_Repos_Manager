import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text

from app.db.database import get_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)

router = APIRouter()

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