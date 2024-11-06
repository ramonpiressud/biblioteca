import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Form.module.css';

const BookSearch = ({ onSelectBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, handleSearch]);  // Adicione handleSearch como dependência

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/books/search?term=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por título ou ISBN"
        className={styles.input}
      />
      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map((book) => (
            <li key={book.id} onClick={() => onSelectBook(book)}>
              {book.title} - ISBN: {book.isbn}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookSearch;
