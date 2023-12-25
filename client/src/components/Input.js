import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import RecentDomains from './RecentDomains';

const Input = () => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');

// Function to update the cache
const updateCache = (domain, data) => {
  const newCache = {
    data: data,
    timestamp: new Date().getTime()
  };
  localStorage.setItem(domain, JSON.stringify(newCache));
};

const checkCache = (domain) => {
  const cacheEntry = JSON.parse(localStorage.getItem(domain));
  if (cacheEntry && (new Date().getTime() - cacheEntry.timestamp) < 24 * 60 * 60 * 1000) {
    return cacheEntry.data;
  }
  return null;
};

  const navigate = useNavigate();

  const validateDomain = (domain) => {
    // Basic regex for domain validation
    const regex = /^(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
    return regex.test(domain);
  };

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
      <RecentDomains/>
    </div>
  );
};

export default Input;
