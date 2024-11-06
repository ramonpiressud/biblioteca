# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get the database URL from the environment variable
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./data/biblioteca.db")

# If using SQLite, ensure the directory for the database file exists
if SQLALCHEMY_DATABASE_URL.startswith("sqlite:///"):
    db_path = SQLALCHEMY_DATABASE_URL.replace("sqlite:///", "", 1)
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    from . import models  # Import your models here
    Base.metadata.create_all(bind=engine)

__all__ = ["engine", "SessionLocal", "Base", "init_db"]
