import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Users from './pages/Users';
import Books from './pages/Books';
import Loans from './pages/Loans';
import './global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/users" component={Users} />
            <Route path="/books" component={Books} />
            <Route path="/loans" component={Loans} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;