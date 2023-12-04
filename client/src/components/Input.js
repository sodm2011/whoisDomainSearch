import React from 'react';

const Input = ({ domain, setDomain, checkDomain }) => {
  return (
    <div>
      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter domain (e.g., example.com)"
      />
      <button onClick={checkDomain}>Check Registration</button>
    </div>
  );
};

export default Input;