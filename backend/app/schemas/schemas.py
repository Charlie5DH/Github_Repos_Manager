
from pydantic import BaseModel
from typing import Optional

class GitHubRepoSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    stargazers_count: int
    forks_count: int
    html_url: str
    login: str
    avatar_url: str
    watchers: int

    class Config:
        orm_mode = True

class NotificationPayload(BaseModel):
    message: str