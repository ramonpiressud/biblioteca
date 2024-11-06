import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoanForm from '../components/LoanForm';
import LoanList from '../components/LoanList';

const Loans = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://localhost:8000/loans');
      setLoans(response.data);
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
    }
  };

  const handleAddLoan = async (newLoan) => {
    try {
      await axios.post('http://localhost:8000/loans', newLoan);
      fetchLoans();
    } catch (error) {
      console.error('Erro ao adicionar empréstimo:', error);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      await axios.put(`http://localhost:8000/loans/${loanId}/return`);
      fetchLoans();
    } catch (error) {
      console.error('Erro ao devolver livro:', error);
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Empréstimos</h1>
      <LoanForm onSubmit={handleAddLoan} />
      <LoanList loans={loans} onReturn={handleReturnBook} />
    </div>
  );
};

export default Loans;