from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from datetime import date, datetime
import requests
from .database import engine, SessionLocal, init_db
from . import models
import re
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

app = FastAPI()

# Inicializa o banco de dados
init_db()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class UserCreate(BaseModel):
    name: str
    cpf: str
    birth_date: date

    @validator('cpf')
    def validate_cpf(cls, v):
        if not re.match(r'^\d{11}$', v):
            raise ValueError('CPF deve conter 11 dígitos numéricos')
        return v

    # Removemos o validador de birth_date

class BookCreate(BaseModel):
    isbn: str
    copies: int = 1  # Novo campo com valor padrão de 1

class LoanCreate(BaseModel):
    user_id: int
    book_id: int

# Rotas
@app.post("/users/")
async def create_user(user: UserCreate):
    db = SessionLocal()
    try:
        existing_user = db.query(models.User).filter(models.User.cpf == user.cpf).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Usuário com este CPF já existe")
        db_user = models.User(**user.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro de integridade ao criar usuário")
    finally:
        db.close()

@app.get("/users/")
async def get_users():
    db = SessionLocal()
    users = db.query(models.User).all()
    db.close()
    return [{"id": user.id, "name": user.name, "cpf": user.cpf, "birth_date": user.birth_date} for user in users]

@app.post("/books/")
async def create_book(book: BookCreate):
    db = SessionLocal()
    try:
        existing_book = db.query(models.Book).filter(models.Book.isbn == book.isbn).first()
        if existing_book:
            existing_book.copies += book.copies
            db.commit()
            db.refresh(existing_book)
            return existing_book

        response = requests.get(f"https://openlibrary.org/api/books?bibkeys=ISBN:{book.isbn}&format=json&jscmd=data")
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Erro ao buscar informações do livro")
        book_data = response.json().get(f"ISBN:{book.isbn}")
        if not book_data:
            raise HTTPException(status_code=400, detail="Livro não encontrado")
        
        db_book = models.Book(
            isbn=book.isbn,
            title=book_data.get("title", "Sem título"),
            author=book_data.get("authors", [{}])[0].get("name", "Autor desconhecido"),
            thumbnail=book_data.get("cover", {}).get("large"),
            copies=book.copies
        )
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro de integridade ao criar livro")
    finally:
        db.close()

@app.get("/books/")
async def get_books():
    db = SessionLocal()
    books = db.query(models.Book).all()
    db.close()
    return books

@app.post("/loans/")
async def create_loan(loan: LoanCreate):
    db = SessionLocal()
    db_loan = models.Loan(**loan.dict(), loan_date=datetime.now())
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    db.close()
    return db_loan

@app.get("/loans/")
async def get_loans():
    db = SessionLocal()
    loans = db.query(models.Loan).all()
    db.close()
    return loans

@app.put("/loans/{loan_id}/return")
async def return_book(loan_id: int):
    db = SessionLocal()
    loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")
    loan.return_date = datetime.now()
    db.commit()
    db.close()
    return {"message": "Livro devolvido com sucesso"}

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        db.close()
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(user)
    db.commit()
    db.close()
    return {"message": "Usuário deletado com sucesso"}

@app.delete("/books/{book_id}")
async def delete_book(book_id: int):
    db = SessionLocal()
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if book is None:
        db.close()
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    db.delete(book)
    db.commit()
    db.close()
    return {"message": "Livro deletado com sucesso"}

@app.get("/users/search")
async def search_users(term: str):
    db = SessionLocal()
    users = db.query(models.User).filter(
        (models.User.name.ilike(f"%{term}%")) | (models.User.cpf.ilike(f"%{term}%"))
    ).all()
    db.close()
    return [{"id": user.id, "name": user.name, "cpf": user.cpf} for user in users]

@app.get("/books/search")
async def search_books(term: str):
    db = SessionLocal()
    books = db.query(models.Book).filter(
        (models.Book.title.ilike(f"%{term}%")) | (models.Book.isbn.ilike(f"%{term}%"))
    ).all()
    db.close()
    return [{"id": book.id, "title": book.title, "isbn": book.isbn} for book in books]
