import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserDetails } from '../types';

/**
 * Login component renders a login form that allows users to login via username or email and password.
 *
 * @param {{ setUser: React.Dispatch<React.SetStateAction<UserDetails | null>>; }} param0 - Object containing a function to update the user state.
 * @param {React.Dispatch<React.SetStateAction<UserDetails | null>>} param0.setUser - Function to update the current user's state in the application.
 * @returns {React.FC} - A functional component that renders the login form UI and handles login functionality.
 */
const Login: React.FC<{ 
    setUser: React.Dispatch<React.SetStateAction<UserDetails | null>>
}> = ({ setUser }) => {
    // Local state variables for form data
    const [localUsername, setLocalUsername] = useState(''); // Stores the username entered by the user
    const [email, setEmail] = useState(''); // Stores the email entered by the user
    const [password, setPassword] = useState(''); // Stores the password entered by the user
    const [error, setError] = useState<string | null>(null); // Stores any error message to be displayed
    const navigate = useNavigate(); // Hook to navigate programmatically

    /**
     * Handles the login form submission, validating input and making a request to the backend API.
     *
     * @param {React.FormEvent} event - The form submission event.
     * @returns {Promise<void>} - A promise that resolves after handling the login request.
     */
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevents default form submission behavior
        setError(null); // Resets any previous error messages

        // Basic form validation
        if ((!localUsername && !email) || (localUsername && email)) {
            setError('Please provide either a username or an email, but not both.');
            return;
        }

        // Email format validation if email is provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address');
                return;
            }
        }

        try {
            // Send login request to the backend
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: localUsername || null, // Sends username if provided, else null
                    work_email: email || null, // Sends email if provided, else null
                    password, // Sends password
                }),
            });
            const user = (await response.json()) as UserDetails; // Parses response as UserDetails type

            // Handle successful login
            if (response.ok) {
                setUser(user); // Sets the logged-in user in the app state
                window.localStorage.setItem('user', JSON.stringify(user)); // Stores user data in localStorage
                navigate('/profile'); // Navigates to the profile page
            } else {
                setError('Could Not Log In. Please Try again.'); // Displays error message for failed login
            }
        } catch (err) {
            setError('Error logging in. Please try again.'); // Displays error for request failure
            console.error(err, 'Error in login at Login.tsx'); // Logs the error to console for debugging
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {/* Display error message if there is one */}
            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}
            {/* Login form */}
            <form onSubmit={(event) => void handleLogin(event)}>
                {/* Username input field */}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={localUsername}
                        onChange={(e) => setLocalUsername(e.target.value)}
                        autoComplete="username"
                    />
                </div>

                {/* Email input field */}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>

                {/* Password input field */}
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required // Field is required
                        autoComplete="current-password"
                    />
                </div>

                {/* Submit button */}
                <button className="login-button" type="submit">
                    Login
                </button>
            </form>

            {/* Link to sign-up page */}
            <div className="signup-link">
                <p>
                    Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
