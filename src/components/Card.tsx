import React from 'react';
import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({ title, children, isDarkMode }) => {
  return (
    <div className={`card ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2 className={`card-title ${isDarkMode ? 'dark-mode' : ''}`}>{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
