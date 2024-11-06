import React from 'react';
import styles from './List.module.css';

const BookList = ({ books, onDelete }) => {
  if (books.length === 0) {
    return <p>Nenhum livro cadastrado.</p>;
  }

  const getThumbnailUrl = (book) => {
    return book.thumbnail || `https://covers.openlibrary.org/b/isbn/${book.isbn}-S.jpg`;
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      onDelete(bookId);
    }
  };

  return (
    <ul className={styles.list}>
      {books.map((book) => (
        <li key={book.id} className={styles.listItem}>
          <div className={styles.bookInfo}>
            <img src={getThumbnailUrl(book)} alt={book.title} className={styles.thumbnail} />
            <div>
              <strong>Título:</strong> {book.title}<br />
              <strong>Autor:</strong> {book.author}<br />
              <strong>ISBN:</strong> {book.isbn}<br />
              <strong>Cópias:</strong> {book.copies}
            </div>
          </div>
          <button onClick={() => handleDelete(book.id)} className={styles.deleteButton}>
            Excluir
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
