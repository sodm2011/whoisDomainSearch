import React, { useState } from 'react';
import { validateDomain, updateCache, checkCache } from './domainUtils';

const AIDomainGenerator = () => {
  const [description, setDescription] = useState('');
  const [seedWords, setSeedWords] = useState('');
  const [generatedDomains, setGeneratedDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [domainStatuses, setDomainStatuses] = useState({}); // New state for domain statuses


  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await fetch('/api/generate-domains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, seedWords })
    });
    const data = await response.json();
    setGeneratedDomains(data.suggestions);
    setIsLoading(false);
  };

  const checkDomainRegistration = async (domain) => {
    if (!validateDomain(domain)) {
      setDomainStatuses(prev => ({ ...prev, [domain]: 'Invalid domain format' }));
      return;
    }

    let status = checkCache(domain);
    if (status) {
      setDomainStatuses(prev => ({ ...prev, [domain]: `Cached: ${status}` }));
      return;
    }

    try {
      const response = await fetch(`/api/check-domain?domain=${domain}`);
      const data = await response.json();
      updateCache(domain, data);
      const registrationStatus = data.registered ? 'Registered' : 'Available';
      setDomainStatuses(prev => ({ ...prev, [domain]: registrationStatus }));
    } catch (error) {
      setDomainStatuses(prev => ({ ...prev, [domain]: 'Error checking status' }));
    }
  };

  return (
    <div>
      <h2>AI Domain Generator</h2>
      <p>Enter a description and seed words to generate domain names. For example: </p>
      <p>Description: This is a website to help user to find the domain they can registry with AI!</p>
      <p>Seed Word: domain, registry, accuracy</p>
      <input 
        type="text" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Website description" 
      />
      <input 
        type="text" 
        value={seedWords} 
        onChange={(e) => setSeedWords(e.target.value)} 
        placeholder="Seed words" 
      />
      <button onClick={handleSubmit}>Generate Domains</button>

      
      {isLoading ? <p>Loading...</p> : (
        <ul>
          {generatedDomains.map((domain, index) => (
            <li key={index}>
                {domain}
                <button onClick={() => checkDomainRegistration(domain)}>Check Registration</button>
                <span>{domainStatuses[domain]}</span>
            </li>
          ))}
        </ul>
      )}

      {/* You can reuse components/logic from earlier versions */}
    </div>
  );
};

export default AIDomainGenerator;
