
import datetime

from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base


class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    owner = Column(String(255), nullable=False)
    stars_count = Column(Integer, default=0)
    imported_at = Column(DateTime, default=datetime.timezone.utc)