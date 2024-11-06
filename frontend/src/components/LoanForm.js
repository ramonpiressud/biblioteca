import React, { useState } from 'react';
import UserSearch from './UserSearch';
import BookSearch from './BookSearch';
import styles from './Form.module.css';

const LoanForm = ({ onSubmit }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser && selectedBook) {
      onSubmit({ user_id: selectedUser.id, book_id: selectedBook.id });
      setSelectedUser(null);
      setSelectedBook(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.searchSection}>
        <h3>Selecionar Usuário</h3>
        {selectedUser ? (
          <div className={styles.selectedItem}>
            <span>{selectedUser.name} (CPF: {selectedUser.cpf})</span>
            <button onClick={() => setSelectedUser(null)} className={styles.clearButton}>Limpar</button>
          </div>
        ) : (
          <UserSearch onSelectUser={setSelectedUser} />
        )}
      </div>
      
      <div className={styles.searchSection}>
        <h3>Selecionar Livro</h3>
        {selectedBook ? (
          <div className={styles.selectedItem}>
            <span>{selectedBook.title} (ISBN: {selectedBook.isbn})</span>
            <button onClick={() => setSelectedBook(null)} className={styles.clearButton}>Limpar</button>
          </div>
        ) : (
          <BookSearch onSelectBook={setSelectedBook} />
        )}
      </div>
      
      <button type="submit" className={styles.button} disabled={!selectedUser || !selectedBook}>
        Registrar Empréstimo
      </button>
    </form>
  );
};

export default LoanForm;
