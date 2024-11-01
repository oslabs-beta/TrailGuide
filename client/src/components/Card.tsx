import React from 'react';
import { CardProps } from '../types';

/**
 * Card component that displays a card with a title and recharts chart content as children.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the card.
 * @param {React.ReactNode} props.children - The chart content to be displayed inside the card.
 * @param {boolean} props.isDarkMode - Flag to determine if dark mode should be applied.
 *
 * @returns {JSX.Element} The rendered Card component.
 */
const Card: React.FC<CardProps> = ({ title, children, isDarkMode }) => {
  return (
    <div className={`card ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="card-header">
      <h2 className={`card-title ${isDarkMode ? 'dark-mode' : ''}`}>{title}</h2>
      </div>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
