import React, { useState } from 'react';
import './MultipleDomainSearch.css';
import RecentDomains from './RecentDomains';

const MultipleDomainSearch = () => {
  const [baseDomain, setBaseDomain] = useState('');
  const [suffixes, setSuffixes] = useState({});
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const suffixOptions = ['.com', '.net', '.org', '.info', '.io', '.ai', '.me', '.cc', '.xyz', '.im', '.co'];

  const handleSuffixChange = (event) => {
    const { value, checked } = event.target;
    setSuffixes(prevSuffixes => ({
      ...prevSuffixes,
      [value]: checked
    }));
  };
  

  const handleCheckAll = () => {
    const allCheckedSuffixes = suffixOptions.reduce((acc, suffix) => {
      acc[suffix] = true;
      return acc;
    }, {});
    setSuffixes(allCheckedSuffixes);
  };
  

  const validateBaseDomain = (domain) => {
    const regex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$/;
    return regex.test(domain);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateBaseDomain(baseDomain)) {
      setError("Invalid domain format. Please enter a valid domain.");
      return;
    }

    const selectedSuffixes = Object.keys(suffixes).filter(key => suffixes[key]);

    if (selectedSuffixes.length === 0) {
      setError("Please select at least one domain suffix.");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await fetch('/api/check-multiple-domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ baseDomain, suffixes: selectedSuffixes })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch domain data.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="multiple-domain-search-container">
      <h2>Multiple Domain Search</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="domain-input"
          type="text"
          value={baseDomain}
          onChange={(e) => setBaseDomain(e.target.value)}
          placeholder="Enter base domain"
        />
        <button className="domain-submit-button" onClick={handleCheckAll}>Check All Domains</button>
        <button className="domain-submit-button" onClick={handleSubmit}>Check Domain</button>
      <div>
            {suffixOptions.map(suffix => (
                <label key={suffix}>
                    <input
                    type="checkbox"
                    value={suffix}
                    checked={suffixes[suffix] || false}
                    onChange={handleSuffixChange}
                    />
                    {suffix}
                </label>
        ))}

      </div>

        {error && <p className="error-message">{error}</p>}

      </form>
            {isLoading ? (<p>Loading...</p>): (null)}
            {results.length > 0 && (
                <table className="table-results">
                    <thead>
                    <tr>
                        <th>Number</th>
                        <th>Website Name</th>
                        <th>Can Be Registered</th>
                        <th>Expiration Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{result.domain}</td>
                        <td>{result.isRegistered ? 'Yes' : 'No'}</td>
                        <td>{result.isRegistered ? 'N/A' : result.expirationDate}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        <RecentDomains/>
    </div>
  );
};

export default MultipleDomainSearch;
