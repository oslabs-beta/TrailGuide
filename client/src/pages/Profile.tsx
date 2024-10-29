import React from 'react';
import { ProfileProps } from "../types";

const Profile: React.FC<ProfileProps> = ({ isDarkMode, user }) => {

  return (
    <div className={`profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="left-container">
        <div className="profile-settings">
          <div className="profile-picture">
            <img 
              src="https://m.media-amazon.com/images/I/51IdQIkjlBL._AC_UF894,1000_QL80_.jpg" 
              alt="Profile" 
            />
          </div>
          <div className="profile-info">
            <div className="info-container">
              <p>Username: {user?.username ?? "Not Logged In"}</p>
            </div>
            <div className="info-container">
              <p>Display Name: {user?.display_name ?? "Not Logged In"}</p>
            </div>
            <div className="info-container">
              <p>Work Email: {user?.work_email ?? "Not Logged In"}</p>
            </div>
            <div className="info-container">
              <p>Work Phone: {user?.work_phone ?? "Not Logged In"}</p>
            </div>
            {/* <div className="info-container">
              <p>Company: {user.company}</p>
            </div> */}
            <img
              className="aws-logo"
              src="https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png"
              alt="AWS Logo"
            />
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="accessKey">Enter Access Key</label>
          <input type="text" id="accessKey" name="accessKey" />
        </div>
        <div className="input-container">
          <label htmlFor="secretAccessKey">Enter Secret Access Key</label>
          <input type="password" id="secretAccessKey" name="secretAccessKey" />
        </div>
        <div className="input-container">
          <label htmlFor="region">Enter Region</label>
          <input type="text" id="region" name="region" />
        </div>
        <button className="submit-button">Submit</button>
        {/* <button className="logout-button logout-button-styled" >Logout</button> */}
        <a className="aws-login-button submit-button" href='https://aws.amazon.com' target="_blank" rel="noopener noreferrer">
          AWS Log-in Information
        </a>
      </div>

      <div className="right-container">
        <div className="settings-section">
          <h3>Alert Settings</h3>
          <div className="info-container">
            <p>Settings related to alerts go here...</p>
          </div>

          <h3>AI Settings</h3>
          <div className="info-container">
            <p>Settings related to AI features go here...</p>
          </div>

          <h3>Homepage Settings</h3>
          <div className="info-container">
            <div className="input-container bordered">
              <label htmlFor="dropdownMenu">Select an Option</label>
              <select id="dropdownMenu" name="dropdownMenu">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
            <div className="input-container bordered">
              <label htmlFor="toggleSwitch">Toggle Feature</label>
              <input type="checkbox" id="toggleSwitch" name="toggleSwitch" />
            </div>
            <div className="input-container bordered">
              <label>Radio Options</label>
              <div>
                <input type="radio" id="radio1" name="radioOption" value="radio1" />
                <label htmlFor="radio1">Radio 1</label>
              </div>
              <div>
                <input type="radio" id="radio2" name="radioOption" value="radio2" />
                <label htmlFor="radio2">Radio 2</label>
              </div>
            </div>
            <div className="input-container bordered">
              <label htmlFor="checkboxOptions">Checkbox Options</label>
              <div>
                <input type="checkbox" id="checkbox1" name="checkboxOptions" value="checkbox1" />
                <label htmlFor="checkbox1">Checkbox 1</label>
              </div>
              <div>
                <input type="checkbox" id="checkbox2" name="checkboxOptions" value="checkbox2" />
                <label htmlFor="checkbox2">Checkbox 2</label>
              </div>
            </div>
            <div className="input-container bordered">
              <label htmlFor="datePicker">Pick a Date</label>
              <input type="date" id="datePicker" name="datePicker" />
            </div>
            <div className="input-container bordered">
              <label htmlFor="tagSelector">Tag Selector</label>
              <input type="text" id="tagSelector" name="tagSelector" placeholder="Add tags..." />
            </div>
            <div className="input-container bordered">
              <label htmlFor="numberInput">Enter a Number</label>
              <input type="number" id="numberInput" name="numberInput" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
