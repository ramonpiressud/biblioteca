import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Form.module.css';

const UserSearch = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/search?term=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por nome ou CPF"
        className={styles.input}
      />
      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map((user) => (
            <li key={user.id} onClick={() => onSelectUser(user)}>
              {user.name} - CPF: {user.cpf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
