import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';

function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`);
      setBooks(response.data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setError('Erro ao carregar livros. Por favor, tente novamente mais tarde.');
    }
  };

  const addBook = async (book) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/books`, book);
      fetchBooks();
      alert('Livro adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      if (error.response && error.response.data) {
        setError(`Erro: ${error.response.data.detail}`);
      } else {
        setError('Erro ao adicionar livro. Por favor, tente novamente.');
      }
      setTimeout(() => setError(null), 10000);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/books/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      setError('Erro ao excluir livro. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <h2>Livros</h2>
      <BookForm onSubmit={addBook} />
      {error && <p className="error">{error}</p>}
      <BookList books={books} onDelete={deleteBook} />
    </div>
  );
}

export default Books;
