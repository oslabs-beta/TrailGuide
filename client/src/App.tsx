import React, { ReactNode, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Home from './pages/Home';
import EventsDashboard from './pages/EventsDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { UserDetails } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [user, setUser] = useState<UserDetails | null>(null);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.body.classList.toggle('dark-mode', !isDarkMode); // Toggle class based on state
  };

  function checkLogin(component: ReactNode): ReactNode {
    return user ? component : <p>You must login to see this page</p>;
  }

  function checkAWSCreds(component: ReactNode): ReactNode {
    if (
      user?.aws_access_key?.length &&
      user?.aws_region?.length > 0 &&
      user?.aws_secret_access_key?.length > 0
    ) {
      return component;
    }
    return (
      <p>
        You must enter your AWS credentials in the profile page to see any data
        here.
      </p>
    );
  }

  return (
    <Router>
      <Navbar
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        username={user?.username ?? null}
        setUser={setUser}
      />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={checkAWSCreds(checkLogin(<Home isDarkMode={isDarkMode} />))}
        />
        <Route
          path="/profile"
          element={checkLogin(
            <Profile isDarkMode={isDarkMode} user={user} setUser={setUser} />
          )}
        />
        <Route
          path="/events-dashboard"
          element={checkAWSCreds(
            checkLogin(<EventsDashboard isDarkMode={isDarkMode} />)
          )}
        />
        {/* </>} */}
      </Routes>
    </Router>
  );
};

export default App;
