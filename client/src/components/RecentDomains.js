import React, { useState, useEffect } from 'react';

const RecentDomains = () => {
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    // Fetch the recent domains from the backend
    const fetchDomains = async () => {
      try {
        const response = await fetch('/api/recent-domains');
        const data = await response.json();
        setDomains(data);
      } catch (error) {
        console.error('Failed to fetch recent domains:', error);
      }
    };

    fetchDomains();
  }, []);

  return (
    <div>
      <h2>Recent Domain Queries</h2>
      <ul>
        {domains.map(domain => (
          <li key={domain._id}>
            {domain.domain} - Registered: {domain.registered ? 'Yes' : 'No'}
            {/* Display other domain details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentDomains;
