import React from 'react';

const Button = ({ children, className, onClick }) => {
  return (
    <button className={`bg-blue-500 text-white rounded px-4 py-2 ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
