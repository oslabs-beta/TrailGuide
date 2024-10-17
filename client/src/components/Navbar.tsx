import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavbarProps } from '../types';
import '../index.css'; // TODO: Do we need to import this here and main?

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode }) => {
  // Accept isDarkMode prop
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // Toggle the dropdown open/close state
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  // Handle logout logic
  const handleLogout = () => {
    console.log('User logged out');
    navigate('/'); // Redirect to home or login page after logout
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      {' '}
      {/* Apply dark mode class */}
      <Link to="/" className="logo">
        TrailGuide
      </Link>
      <Link to="/events-dashboard" className="nav-button">
        Events Dashboard
      </Link>
      <Link to="/login" className="nav-button">
        Login
      </Link>
      <button onClick={toggleDarkMode} className="nav-button">
        {isDarkMode ? 'Light Mode' : 'Dark Mode'} {/* Update button text */}
      </button>
      <div
        className="nav-button"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        User Profile
      </div>
      {dropdownOpen && (
        <div className="dropdown" ref={dropdownRef}>
          <Link to="/profile" className="dropdown-link">
            Profile
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
