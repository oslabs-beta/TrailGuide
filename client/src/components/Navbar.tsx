import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    //logout logic here
    console.log('User logged out');
  };

  return (
    <nav>
      <button className="nav-button" onClick={toggleDropdown}>
        User Profile
      </button>
      <Link to="/" className="Logo">
        TrailGuide
      </Link>
      <button className="nav-button">Events DashBoard</button>

      <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
        <Link to="/profile" className="dropdown-link">
          Profile
        </Link>
        <a href="#" className="dropdown-link" onClick={handleLogout}>
          Logout
        </a>
      </div>
    </nav>
  );
};

export default Navbar;