import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import '../index.css';

const Navbar: React.FC = () => {
  // State to manage dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Hook for navigation

  // Toggle the dropdown open/close state
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle logout logic
  const handleLogout = () => {
    // Logout logic here (e.g., clear tokens, etc.)
    console.log('User logged out');
    navigate('/'); // Redirect to home or login page after logout
  };

  // Close dropdown if clicked outside
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
    <nav>
      <Link to="/" className="logo">
        TrailGuide
      </Link>
      <Link to="/events-dashboard" className="nav-button">
        Events Dashboard
      </Link>
      <Link to="/login" className="nav-button">
        Login
      </Link>
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