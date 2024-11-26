import React from 'react';
import styles from './List.module.css';

const UserList = ({ users, onDelete }) => {
  const handleDelete = (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      onDelete(userId);
    }
  };

  return (
    <ul className={styles.list}>
      {users.map((user) => (
        <li key={user.id} className={styles.listItem}>
          <div>
            <strong>Nome:</strong> {user.name}<br />
            <strong>CPF:</strong> {user.cpf}<br />
            <strong>Data de Nascimento:</strong> {new Date(user.birth_date + 'T00:00:00').toLocaleDateString()}
          </div>
          <button className={styles.deleteButton} onClick={() => handleDelete(user.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
