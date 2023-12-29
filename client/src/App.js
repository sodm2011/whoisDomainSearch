import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Input from './components/Input';
import DomainDetails from './components/DomainDetails';
import MultipleDomainSearch from './components/MultipleDomainSearch';
import AiPage from './components/AiPage'

function App() {
  return (
    <Router>
        <div className="navbar">
          <Link to="/">whois Search</Link>
          <Link to="/multiple-domain-search">Multiple Domain Search</Link>
          <Link to="/AI-generated-domain">Let AI generate domain</Link>
        </div>
      <Routes>
        <Route path="/" element={<Input/>} />
        <Route path="/details" element={<DomainDetails />} />
        <Route path="/multiple-domain-search" element={<MultipleDomainSearch />} />
        <Route path="/AI-generated-domain" element={ <AiPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
