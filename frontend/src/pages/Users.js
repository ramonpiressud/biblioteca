import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, newUser);
      fetchUsers();
      alert('Usuário adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      if (error.response && error.response.data) {
        alert(`Erro: ${error.response.data.detail}`);
      } else {
        alert('Erro ao adicionar usuário. Por favor, tente novamente.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Usuários</h1>
      <UserForm onSubmit={handleAddUser} />
      <UserList users={users} onDelete={handleDeleteUser} />
    </div>
  );
};

export default Users;
