import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="clock-wrapper">
      <div className="clock">
        <div className="needle-container">
          <div className="needle"></div>
        </div>
        <div className="needle-container1">
          <div className="needle1"></div>
        </div>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default LoadingSpinner;
