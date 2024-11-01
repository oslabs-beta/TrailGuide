import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavbarProps } from '../types';
import LOGO from '../assets/RAILGUIDE.png';
//import '../index.scss';

/**
 * Navbar component that provides navigation links and user interaction options.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Function} props.toggleDarkMode - Function to toggle dark mode.
 * @param {boolean} props.isDarkMode - Boolean indicating if dark mode is enabled.
 * @param {string} props.username - The username of the logged-in user.
 * @param {Function} props.setUser - Function to set the user state.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 *
 * @example
 * <Navbar
 *   toggleDarkMode={toggleDarkMode}
 *   isDarkMode={isDarkMode}
 *   username={username}
 *   setUser={setUser}
 * />
 */
const Navbar: React.FC<NavbarProps> = ({
  toggleDarkMode,
  isDarkMode,
  username,
  setUser,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Function to handle user logout
  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('user');
    navigate('/login');
  };

  // Effect to close the dropdown if clicking outside of it
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
      {/* Logo linking to home */}
      <Link to="/home" className="logo" title="Home">
        <img src={LOGO} alt="Wood Plank T" className="logo-image" />
      </Link>
      <div className="nav-buttons">
        {/* Link to events dashboard */}
        <Link to="/events-dashboard" className="nav-button">
          RECENT EVENTS
        </Link>
        {/* Button to toggle dark mode */}
        <button onClick={toggleDarkMode} className="nav-button">
          {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>

        {/* Dropdown toggle button */}
        <div
          className="nav-button"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          {username && typeof username === 'string'
            ? username.toUpperCase()
            : 'USER'}
        </div>
      </div>
      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="dropdown" ref={dropdownRef}>
          <Link to="/profile" className="dropdown-link">
            Profile
          </Link>
          {!username && (
            <Link to="/login" className="dropdown-link">
              Login
            </Link>
          )}
          {username && (
            <div className="dropdown-link" onClick={handleLogout}>
              Logout
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
