import React, { useState } from 'react';
import axios from 'axios';
import styles from './Form.module.css';

const BookForm = ({ onSubmit }) => {
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN%3A${isbn}&format=json&jscmd=data`);
      const bookData = response.data[`ISBN:${isbn}`];
      
      if (!bookData) {
        throw new Error('Livro não encontrado');
      }

      const book = {
        isbn: isbn,
        title: bookData.title,
        author: bookData.authors ? bookData.authors[0].name : 'Autor desconhecido',
        thumbnail: bookData.cover ? bookData.cover.medium : null,
        copies: copies
      };

      onSubmit(book);
      setIsbn('');
      setCopies(1);
    } catch (error) {
      setError('Erro ao buscar informações do livro. Verifique o ISBN e tente novamente.');
      console.error('Erro ao buscar livro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        placeholder="ISBN do livro"
        required
        className={styles.input}
        disabled={isLoading}
      />
      <input
        type="number"
        value={copies}
        onChange={(e) => setCopies(parseInt(e.target.value))}
        placeholder="Número de cópias"
        required
        min="1"
        className={styles.input}
        disabled={isLoading}
      />
      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? 'Buscando...' : 'Adicionar Livro'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default BookForm;
