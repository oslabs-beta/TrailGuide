import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC<{
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setUsername }) => {
  const [username, setLocalUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Basic form validation
    if ((!username && !email) || (username && email)) {
      setError("Please provide either a username or an email, but not both");
      return;
    }

    // Email format validation if email is provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }
    }

    try {
      //Send resgiter request to the backend
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || null,
          work_email: email || null,
          password,
        }),
      });
      const { username: dbUsername } = await response.json() as {username: string};
      console.log(dbUsername);
      if (response.ok) {
        setUsername(dbUsername);
        console.log("Sign-up successful!");
        navigate("/profile");
      }
    } catch (err) {
      setError("Error logging in. Please try again.");
      console.error(err, "Error in login at Login.tsx;");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={(event) => void handleLogin(event)}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
      <div className="signup-link">
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
