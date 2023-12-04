import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Input = () => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateDomain = (domain) => {
    // Basic regex for domain validation
    const regex = /^(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
    return regex.test(domain);
  };

  const checkDomain = async () => {
    if (!validateDomain(domain)) {
      setError("Invalid domain format. Please enter a valid domain.");
      return;
    }

    try {
      const response = await fetch(`/api/check-domain?domain=${domain}`);
      const data = await response.json();
      console.log("get data", data);
      if (data) {
        navigate('/details', { state: { domainData: data } });
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch domain data.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={domain}
        onChange={(e) => {
          setDomain(e.target.value);
          setError(''); // Reset error message when user types
        }}
        placeholder="Enter domain (e.g., example.com)"
      />
      <button onClick={checkDomain}>Check Registration</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Input;
