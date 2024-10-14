import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    // Logout logic here
    console.log('User logged out');
  };

  return (
    <nav>
      <Link to="/" className="logo">
        TrailGuide
      </Link>
      <button className="nav-button">Events Dashboard</button>
      <div className="nav-button" onClick={toggleDropdown}>
        User Profile
      </div>
      

      {dropdownOpen && (
        <div className="dropdown">
          <Link to="/profile" className="dropdown-link">
            Profile
          </Link>
          <a href="#" className="dropdown-link" onClick={handleLogout}>
            Logout
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
