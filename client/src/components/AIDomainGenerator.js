import React, { useState, useEffect } from 'react';
import { validateDomain, updateCache, checkCache } from './domainUtils';
import './AIDomainGenerator.css'; 


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

      // Process the suggestions to extract domain names
    const domainSuggestions = data.suggestions.map(
        suggestion => suggestion.trim().replace(/^\d+\.\s*/, '')); // Removes numbers and extra spaces

    localStorage.setItem('lastApiResult', JSON.stringify(domainSuggestions));

    setGeneratedDomains(domainSuggestions);
    setIsLoading(false);
  };

  const checkDomainRegistration = async (domain) => {
    if (!validateDomain(domain)) {
      setDomainStatuses(prev => ({ ...prev, [domain]: 'Invalid domain format' }));
      return;
    }

    let status = checkCache(domain);
    if (status) {
      setDomainStatuses(prev => ({ ...prev, [domain]: status.available ? 'Available' : 'Registered' }));
      return;
    }

    try {
      const response = await fetch(`/api/check-domain?domain=${domain}`);
      console.log("response", response)
      const data = await response.json();
      console.log("data", data)
        if (data) {
        updateCache(domain, data);
        const registrationStatus = data.registered ? 'Registered' : 'Available';
        setDomainStatuses(prev => ({ ...prev, [domain]: registrationStatus }));
        }

    } catch (error) {
      console.log("error", error);
      setDomainStatuses(prev => ({ ...prev, [domain]: 'Error checking status' }));
    }
  };

  useEffect(() => {
    // Check for stored API results when the component mounts
    const storedResult = localStorage.getItem('lastApiResult');
    if (storedResult) {
      setGeneratedDomains(JSON.parse(storedResult));
    }
  }, []);

  return (
    <div className='ai-domain-generator-container'>
      <h2>AI-Powered Domain Name Generator</h2>
      <p>Welcome to the AI Domain Generator! Here, you can leverage the power of AI to generate innovative and relevant domain names based on your specific needs. Simply provide a brief description of your website and some seed words, and our AI will do the rest, suggesting a list of potential domain names.</p>
      <p>Example:</p>
      <p>Description: "A platform for online education and e-learning"</p>
      <p>Seed Words: "education, online, platform"</p>

      <div className="input-group">
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
        </div>

      
      {isLoading ? <p>Loading...</p> : (
        <ul className="domain-list">
          {generatedDomains.map((domain, index) => (
            <li key={index} className="domain-item">
                {domain}
                <button onClick={() => checkDomainRegistration(domain)}>Check Registration</button>
                <span>{domainStatuses[domain]}</span>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default AIDomainGenerator;
