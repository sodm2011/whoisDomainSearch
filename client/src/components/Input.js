import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecentDomains from './RecentDomains';
import { validateDomain, updateCache, checkCache } from './domainUtils';
import './Input.css';

const Input = () => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkDomain = async () => {
    const currentTime = new Date().getTime();

    if (!validateDomain(domain)) {
      setError("Invalid domain format. Please enter a valid domain.");
      return;
    }

    try {
      const cachedData = checkCache(domain);

      if (cachedData) {
        console.log("using cached data");
        navigate('/details', { state: { domainData: cachedData } });
        return;
      }

      const response = await fetch(`/api/check-domain?domain=${domain}`);
      const data = await response.json();

      if (data) {
        console.log("using fetched data");
        updateCache(domain, data); // Update cache with new data
        navigate('/details', { state: { domainData: data } });
      }
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch domain data.');
    }
  };

  return (
    <div className="input-container">
      <input
        className="input-field"
        type="text"
        value={domain}
        onChange={(e) => {
          setDomain(e.target.value);
          setError(''); // Reset error message when user types
        }}
        placeholder="Enter domain (e.g., example.com)"
      />
      <button className="submit-button" onClick={checkDomain}>Check Registration</button>
      {error && <p className="error-message">{error}</p>}
      <RecentDomains/>
    </div>
  );
};

export default Input;
