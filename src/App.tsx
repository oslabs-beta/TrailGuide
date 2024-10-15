import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Home from './pages/Home';
import EventsDashboard from './pages/EventsDashboard';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    document.body.classList.toggle('dark-mode', !isDarkMode); // Toggle class based on state
  };

  return (
    <Router>
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <Routes>
        <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
        <Route path="/profile" element={<Profile isDarkMode={isDarkMode} />} />
        <Route path="/events-dashboard" element={<EventsDashboard isDarkMode={isDarkMode} />} />
      </Routes>
    </Router>
  );
};

export default App;
