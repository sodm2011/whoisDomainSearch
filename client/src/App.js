import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Input from './components/Input';
import DomainDetails from './components/DomainDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Input/>} />
        <Route path="/details" element={<DomainDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
