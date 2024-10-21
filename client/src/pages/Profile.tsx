import React from "react";
import { ProfileProps } from "../types";
import "../profile.css";

interface User {
  username: string;
  displayName: string;
  email: string;
  phone: string;
  company: string;
  link: string;
}

const user: User = {
  username: "BobTest",
  displayName: "Bob Test",
  email: "BobTest@gmail.com",
  phone: "+1 (234) 567-890",
  company: "Test Guys Inc.",
  link: "https://aws.amazon.com",
};

const Profile: React.FC<ProfileProps> = ({ isDarkMode }) => {
  return (
    <div className={`profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Left Container */}
      <div className="left-container">
        {/* Profile Settings Section */}
        <div className="profile-settings">
          <div className="profile-picture">
            <img src="https://m.media-amazon.com/images/I/51IdQIkjlBL._AC_UF894,1000_QL80_.jpg" alt="Profile" />
          </div>
          <div className="profile-info">
            <p>Username: {user.username}</p>
            <p>Display Name: {user.displayName}</p>
            <p>Work Email: {user.email}</p>
            <p>Work Phone: {user.phone}</p>
          </div>
        </div>
      </div>

      {/* Right Container */}
      <div className="right-container">
        {/* Settings Sections */}
        <div className="settings-section">
          <h3>Alert Settings</h3>
          <p>Settings related to alerts go here...</p>

          <h3>AI Settings</h3>
          <p>Settings related to AI features go here...</p>

          <h3>Homepage Settings</h3>
          <p>Settings related to the homepage go here...</p>
        </div>
      </div>

      {/* AWS Login Information */}
      <div className="aws-login">
        <a href={user.link} target="_blank" rel="noopener noreferrer">
          AWS Log-in Information
        </a>
      </div>

      {/* Logout Button */}
      <button className="logout-button">Logout</button>
    </div>
  );
};

export default Profile;
