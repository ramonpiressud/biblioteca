import React from 'react';
import styles from './List.module.css';

const LoanList = ({ loans, onReturn }) => {
  return (
    <ul className={styles.list}>
      {loans.map((loan) => (
        <li key={loan.id} className={styles.listItem}>
          <div>
            <strong>Livro:</strong> {loan.book_title} | <strong>Usuário:</strong> {loan.user_name} <br />
            <strong>Data de empréstimo:</strong> {new Date(loan.loan_date).toLocaleDateString()} | 
            <strong>Data de devolução:</strong> {loan.return_date ? new Date(loan.return_date).toLocaleDateString() : 'Não devolvido'}
          </div>
          {!loan.return_date && (
            <button className={styles.deleteButton} onClick={() => onReturn(loan.id)}>Devolver</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default LoanList;
