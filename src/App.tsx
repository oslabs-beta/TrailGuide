import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Navbar from './components/Navbar.tsx';
import Profile from './pages/Profile.tsx';
import Home from './pages/Home';
import EventsDashboard from './pages/EventsDashboard.tsx';
//import Profile from './pages/Profile';
//import EventsDashboard from './pages/EventsDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events-dashboard" element={<EventsDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

{
  /* <Route path="/" element={<Home />} />
        
        <Route path="/events" element={<EventsDashboard />} /> */
}
