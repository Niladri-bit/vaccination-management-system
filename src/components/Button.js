import React from 'react';

function Button({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
      }}
    >
      {label}
    </button>
  );
}

export default Button;
