import React from 'react';
import { AWSCredentials, ProfileProps, UserDetails } from '../types';

/**
 * Profile component renders the user's profile information, AWS credentials form, and handles updates.
 *
 * @param {ProfileProps} props - Props passed to the Profile component.
 * @returns {React.FC<ProfileProps>} - A functional component that displays user profile information and manages AWS credentials.
 */
const Profile: React.FC<ProfileProps> = ({
    isDarkMode, // Boolean indicating if dark mode is active
    user, // User details object containing user information
    updateCredentials, // Function to update AWS credentials
}) => {

    /**
     * Handles the submission of AWS credentials by extracting values from form fields,
     * validating them, and updating the credentials in the application state.
     *
     * @returns {void}
     */
    function handleCredentialSubmit() {
      const locallyStoredUser: UserDetails = JSON.parse(
        window.localStorage.getItem('user')!
      ) as UserDetails;

        // Retrieve values from input fields by their IDs
        const domCollectedCreds: AWSCredentials = {
            aws_access_key:
                (document.getElementById('accesskey') as HTMLInputElement | null)?.value ??
                'Could not find accessKey element', // Fallback message if element is not found
            aws_secret_access_key:
                (document.getElementById('secretAccessKey') as HTMLInputElement | null)?.value ??
                'Could not find secretAccessKey element', // Fallback message if element is not found
            aws_region:
                (document.getElementById('region') as HTMLInputElement | null)?.value ??
                'Could not find region element', // Fallback message if element is not found
        };

        // Log retrieved user details and AWS credentials to the console for debugging purposes
        console.log(locallyStoredUser); // Logs the locally stored user details
        console.log(domCollectedCreds); // Logs the collected AWS credentials

        // Update credentials, preferring non-empty values from input fields, otherwise use locally stored values
        updateCredentials({
            aws_access_key:
                domCollectedCreds.aws_access_key !== ''
                    ? domCollectedCreds.aws_access_key
                    : locallyStoredUser.aws_access_key ?? 'No locally stored access key',
            aws_secret_access_key:
                domCollectedCreds.aws_secret_access_key !== ''
                    ? domCollectedCreds.aws_secret_access_key
                    : locallyStoredUser.aws_secret_access_key ?? 'No locally stored secret access key',
            aws_region:
                domCollectedCreds.aws_region !== ''
                    ? domCollectedCreds.aws_region
                    : locallyStoredUser.aws_region ?? 'No locally stored region',
        });
    }

    return (
        <div className={`profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Left container for displaying user profile settings and AWS logo */}
            <div className="left-container">
                <div className="profile-settings">
                    <div className="profile-picture">
                        {/* Profile picture section with a placeholder image URL */}
                        <img
                            src="https://m.media-amazon.com/images/I/51IDtJkLBL._AC_UF894,1000_QL80_.jpg"
                            alt="Profile" // Alt text for accessibility
                        />
                    </div>
                </div>
                
                {/* Section to display user information with default messages if not logged in */}
                <div className="profile-info">
                    {/* Display username or "Not Logged In" if no user data is available */}
                    <div className="info-container">
                        <p>Username: {user?.username ?? 'Not Logged In'}</p>
                    </div>
                    {/* Display display name or "Not Logged In" if not provided */}
                    <div className="info-container">
                        <p>Display Name: {user?.display_name ?? 'Not Logged In'}</p>
                    </div>
                    {/* Display work email or "Not Logged In" if not provided */}
                    <div className="info-container">
                        <p>Work Email: {user?.work_email ?? 'Not Logged In'}</p>
                    </div>
                    {/* Display work phone or "Not Logged In" if not provided */}
                    <div className="info-container">
                        <p>Work Phone: {user?.work_phone ?? 'Not Logged In'}</p>
                    </div>
                </div>

                {/* AWS Logo - Positioned in the left container for branding */}
                <div className="profile-picture">
                    <img
                        className="aws-logo"
                        src="https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png"
                        alt="AWS Logo" // Alt text for AWS branding
                    />
                </div>
            </div>

            {/* Right container where users can input AWS credentials */}
            <div className="right-container">
                {/* Input field for AWS Access Key */}
                <div className="input-container">
                    <label htmlFor="accesskey">Enter Access Key</label>
                    <input
                        type="text"
                        id="accesskey"
                        name="accesskey"
                        aria-label="AWS Access Key" // Accessibility label for screen readers
                    />
                </div>

                {/* Input field for AWS Secret Access Key - hidden input for security */}
                <div className="input-container">
                    <label htmlFor="secretAccessKey">Enter Secret Access Key</label>
                    <input
                        type="password"
                        id="secretAccessKey"
                        name="secretAccessKey"
                        aria-label="AWS Secret Access Key" // Accessibility label for screen readers
                    />
                </div>

                {/* Input field for AWS Region - allows users to specify AWS region */}
                <div className="input-container">
                    <label htmlFor="region">Enter Region</label>
                    <input
                        type="text"
                        id="region"
                        name="region"
                        aria-label="AWS Region" // Accessibility label for screen readers
                    />
                </div>

                {/* Button to submit AWS credentials; triggers handleCredentialSubmit function */}
                <button
                    className="submit-button"
                    onClick={handleCredentialSubmit} // Calls function to handle AWS credential submission
                >
                    Submit
                </button>

                {/* Link to AWS login information page - opens in a new tab */}
                <div className="aws-login-button submit-button">
                    <a
                        href="https://aws.amazon.com"
                        target="_blank" // Opens link in a new tab
                        rel="noopener noreferrer" // Prevents security issues with target="_blank"
                    >
                        AWS Log-in Information
                    </a>
                </div>
            </div>

      {/*}
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
                <input
                  type="radio"
                  id="radio1"
                  name="radioOption"
                  value="radio1"
                />
                <label htmlFor="radio1">Radio 1</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="radio2"
                  name="radioOption"
                  value="radio2"
                />
                <label htmlFor="radio2">Radio 2</label>
              </div>
            </div>
            <div className="input-container bordered">
              <label htmlFor="checkboxOptions">Checkbox Options</label>
              <div>
                <input
                  type="checkbox"
                  id="checkbox1"
                  name="checkboxOptions"
                  value="checkbox1"
                />
                <label htmlFor="checkbox1">Checkbox 1</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="checkbox2"
                  name="checkboxOptions"
                  value="checkbox2"
                />
                <label htmlFor="checkbox2">Checkbox 2</label>
              </div>
            </div>
            <div className="input-container bordered">
              <label htmlFor="datePicker">Pick a Date</label>
              <input type="date" id="datePicker" name="datePicker" />
            </div>
            <div className="input-container bordered">
              <label htmlFor="tagSelector">Tag Selector</label>
              <input
                type="text"
                id="tagSelector"
                name="tagSelector"
                placeholder="Add tags..."
              />
            </div>
            <div className="input-container bordered">
              <label htmlFor="numberInput">Enter a Number</label>
              <input type="number" id="numberInput" name="numberInput" />
            </div>
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

export default Profile;
