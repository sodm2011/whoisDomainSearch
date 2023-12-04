import React from 'react';
import { useLocation } from 'react-router-dom';

const DomainDetails = () => {
  const location = useLocation();
  const data = location.state?.domainData;

  return (
    <div>
      <h2>Domain Details</h2>
      <p><strong>Domain:</strong> {data.domain}</p>
      <p><strong>Registered:</strong> {data.available ? 'No' : 'Yes'}</p>
      <p><strong>Registration Date:</strong> {data.creation_datetime}</p>
      {/* Display other information from data as needed */}
      <pre>{data.info}</pre> {/* Display raw WHOIS info */}
    </div>
  );
};

export default DomainDetails;
