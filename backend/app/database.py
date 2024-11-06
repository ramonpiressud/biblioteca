from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Certifique-se de que o diretório data existe
os.makedirs("/app/data", exist_ok=True)

SQLALCHEMY_DATABASE_URL = "sqlite:///./data/biblioteca.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    from . import models  # Importa os modelos
    Base.metadata.create_all(bind=engine)

# Exporta a função init_db
__all__ = ["engine", "SessionLocal", "Base", "init_db"]
