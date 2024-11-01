import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SignUp component renders a sign-up form that allows users to create an account with various details.
 *
 * @returns {React.FC} - A functional component that renders the sign-up form UI and handles sign-up functionality.
 */
const SignUp: React.FC = () => {
    // Local state variables for form data
    const [username, setUsername] = useState(''); // Stores the username entered by the user
    const [displayName, setDisplayName] = useState(''); // Stores the display name entered by the user
    const [work_email, setWorkEmail] = useState(''); // Stores the work email entered by the user
    const [workPhone, setWorkPhone] = useState(''); // Stores the work phone number entered by the user
    const [password, setPassword] = useState(''); // Stores the password entered by the user
    const [confirmPassword, setConfirmPassword] = useState(''); // Stores the confirmed password for validation
    const [error, setError] = useState<string | null>(null); // Stores any error message to be displayed
    const navigate = useNavigate(); // Hook to navigate programmatically

    /**
     * Handles the sign-up form submission, validating input and making a request to the backend API.
     *
     * @param {React.FormEvent} event - The form submission event.
     * @returns {Promise<void>} - A promise that resolves after handling the sign-up request.
     */
    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevents default form submission behavior
        setError(null); // Resets any previous error messages

        // Basic form validation
        if (!username || !work_email || !password || !confirmPassword) {
            setError('Please fill in fields that is mandatory');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(work_email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Password match validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Send register request to the backend
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    displayName,
                    work_email,
                    workPhone,
                }),
            });

            // Handle successful sign-up
            if (response.ok) {
                navigate('/login'); // Navigate to the login page after successful registration
            } else {
                setError('Error signing up. Please try again.'); // Display error message if sign-up fails
            }
        } catch (err) {
            setError('Error signing up. Please try again.'); // Displays error for request failure
            console.error(err, 'Error in signup at SignUp.tsx'); // Logs the error to console for debugging
        }
    };

    return (
        <div className="signup-container">
            {/* Title of the sign-up form */}
            <h2>Sign Up</h2>
            
            {/* Error message area that displays any errors that occurred during sign-up */}
            {error && <div className="error-message">{error}</div>}
            
            {/* Sign-up form that contains input fields for user details */}
            <form onSubmit={(event) => void handleSignUp(event)}>
                
                {/* Username input field: used for entering the desired username */}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required // Required field for the sign-up form
                    />
                </div>

                {/* Display name input field: used for entering the name that will be shown publicly */}
                <div className="form-group">
                    <label htmlFor="displayName">Display Name:</label>
                    <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required // Required field for the display name
                    />
                </div>

                {/* Work email input field: used for entering a valid work email address */}
                <div className="form-group">
                    <label htmlFor="work_email">Work Email:</label>
                    <input
                        type="email"
                        id="work_email"
                        value={work_email}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        required // Required field for a valid work email
                    />
                </div>

                {/* Work phone input field: used for entering a phone number associated with work */}
                <div className="form-group">
                    <label htmlFor="workPhone">Work Phone:</label>
                    <input
                        type="text"
                        id="workPhone"
                        value={workPhone}
                        onChange={(e) => setWorkPhone(e.target.value)}
                        required // Required field for the work phone number
                    />
                </div>

                {/* Password input field: used for entering a password for the account */}
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required // Required field for the password
                    />
                </div>

                {/* Confirm password input field: used for re-entering the password to ensure accuracy */}
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required // Required field for password confirmation
                    />
                </div>

                {/* Submit button to initiate the sign-up process */}
                <button className="signup-button" type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;
