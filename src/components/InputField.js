import React from 'react';

function InputField({ type, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        padding: '10px',
        margin: '10px 0',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px'
      }}
    />
  );
}

export default InputField;
