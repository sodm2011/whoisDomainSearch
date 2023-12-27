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
<div className="recent-domains-container">
  <h2>Recent Domain Queries</h2>
  <div className="table-wrapper">

    <table className="table-recent-domains">
      <thead>
        <tr>
          <th>Domain</th>
          <th>Registered</th>
        </tr>
      </thead>
      <tbody>
        {domains.map(domain => (
          <tr key={domain._id}>
            <td>{domain.domain}</td>
            <td>{domain.registered ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
</div>

  );
};

export default RecentDomains;
