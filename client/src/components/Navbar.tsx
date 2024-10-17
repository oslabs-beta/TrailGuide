import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavbarProps } from '../types';
import woodPlankT from '../assets/Untitled design (2).png';
import '../index.css';

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/'); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={isDarkMode ? 'dark-mode' : ''}>
      <Link to="/" className="logo" title="Home">
      <img src={woodPlankT} alt="Wood Plank T" className="logo-image" />
      RAILGUIDE
      </Link>
      <div className="nav-buttons">
        <Link to="/events-dashboard" className="nav-button">
          Events Dashboard
        </Link>
        <button onClick={toggleDarkMode} className="nav-button">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div
          className="nav-button"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          User
        </div>
      </div>

      {dropdownOpen && (
        <div className="dropdown" ref={dropdownRef}>
          <Link to="/profile" className="dropdown-link">
            Profile
          </Link>
          <Link to="/login" className="dropdown-link">
          Login
        </Link>
          <div className="dropdown-link" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
