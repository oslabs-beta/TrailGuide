import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Home from './pages/Home';
import EventsDashboard from './pages/EventsDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { AWSCredentials, UserDetails } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [user, setUser] = useState<UserDetails | null>(null);

  const updateCredentials = useCallback(
    function (credentials: AWSCredentials): void {
      fetch('/credentials', {
        method: 'POST',
        body: JSON.stringify({
          ...credentials,
          username: user?.username ?? 'No Active User',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok)
            throw Error('Server Error while updating aws credentials');
          return response.json();
        })
        .then((data: UserDetails) => {
          setUser(data);
          window.localStorage.setItem('user', JSON.stringify(data));
        })
        .catch((error: Error) => {
          console.error(error);
        });
    },
    // we don't want to update on user update, because it would create an infinte loop, only on app reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // check for a user session and update the user if found
  useEffect(() => {
    if (window.localStorage.getItem('user')) {
      const locallyStoredUser: UserDetails = JSON.parse(
        window.localStorage.getItem('user')!
      ) as UserDetails;
      updateCredentials(locallyStoredUser);
    }
  }, [updateCredentials]);

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
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/home"
          element={checkLogin(checkAWSCreds(<Home isDarkMode={isDarkMode} />))}
        />
        <Route
          path="/profile"
          element={checkLogin(
            <Profile
              isDarkMode={isDarkMode}
              user={user}
              updateCredentials={updateCredentials}
            />
          )}
        />
        <Route
          path="/events-dashboard"
          element={checkLogin(
            checkAWSCreds(<EventsDashboard isDarkMode={isDarkMode} />)
          )}
        />
      </Routes>
    </Router>
  );
};

export default App;
