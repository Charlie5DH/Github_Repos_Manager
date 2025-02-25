from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.routes import router as api_router

from app.db.database import Base, engine

app = FastAPI(title="Github Repo Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure DB tables exist
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(api_router, prefix="/api")
