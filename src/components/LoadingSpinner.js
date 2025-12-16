import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  return (
    <div className="loading-spinner">
      <div className={`spinner ${sizeClass}`}></div>
      <p className="spinner-text">{text}</p>
    </div>
  );
};

export default LoadingSpinner;