import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import styles from './Form.module.css';

const UserForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertemos a data para o formato ISO (YYYY-MM-DD) antes de enviar
    const isoDate = new Date(birthDate).toISOString().split('T')[0];
    onSubmit({ name, cpf: cpf.replace(/[^\d]/g, ''), birth_date: isoDate });
    setName('');
    setCpf('');
    setBirthDate('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome completo"
        required
        className={styles.input}
      />
      <InputMask
        mask="999.999.999-99"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        placeholder="CPF"
        required
        className={styles.input}
      />
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Adicionar Usuário</button>
    </form>
  );
};

export default UserForm;
