import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/">Início</Link></li>
          <li><Link to="/users">Usuários</Link></li>
          <li><Link to="/books">Livros</Link></li>
          <li><Link to="/loans">Empréstimos</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;