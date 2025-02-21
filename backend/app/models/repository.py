
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base


class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True, default="")
    stargazers_count = Column(Integer, nullable=False)
    forks_count = Column(Integer, nullable=False)
    html_url = Column(String(255), nullable=False)
    login = Column(String(255), nullable=False)
    avatar_url = Column(String(255), nullable=False)
    watchers = Column(Integer, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
