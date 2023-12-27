import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Input from './components/Input';
import DomainDetails from './components/DomainDetails';
import MultipleDomainSearch from './components/MultipleDomainSearch';

function App() {
  return (
    <Router>
        <div className="navbar">
          <Link to="/">whois Search</Link>
          <Link to="/multiple-domain-search">Multiple Domain Search</Link>
        </div>
      <Routes>
        <Route path="/" element={<Input/>} />
        <Route path="/details" element={<DomainDetails />} />
        <Route path="/multiple-domain-search" element={<MultipleDomainSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
