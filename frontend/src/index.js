import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.process = {
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    REACT_APP_API_URL: 'http://localhost:8000'
  }
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
