// import { deepStrictEqual } from 'assert';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [work_email, setWorkEmail] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

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
      //Send resgiter request to the backend
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

      if (response.ok) {
        console.log('Sign-up successful!');
        navigate('/profile');
      }
    } catch (err) {
      setError('Error signing up. Please try again.');
      console.error(err, 'Error in signup at SignUp.tsx;');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={(event) => void handleSignUp(event)}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="displayName">Display Name:</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="work_email">Work Email:</label>
          <input
            type="email"
            id="work_email"
            value={work_email}
            onChange={(e) => setWorkEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="workPhone">Work Phone:</label>
          <input
            type="text"
            id="workPhone"
            value={workPhone}
            onChange={(e) => setWorkPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button className="signup-button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
