import React, { useState } from 'react';
import './App.css';
import Input from './components/Input';
import Result from './components/Result';

function App() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');

  const checkDomain = async () => {
    try {
      const response = await fetch(`/api/check-domain?domain=${domain}`);
      const data = await response.json();
      if (data) {
        setResult(`Domain is registered. Registration date: ${data.creation_datetime}`);
      } else {
        setResult('Domain is not registered.');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('Failed to fetch domain data.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Input domain={domain} setDomain={setDomain} checkDomain={checkDomain} />
        <Result result={result} />
      </header>
    </div>
  );
}

export default App;