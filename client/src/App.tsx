import React from 'react';
import { BrowserRouter as Router, /*Route,*/ Routes } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
//import Home from './pages/Home';
//import Profile from './pages/Profile';
//import EventsDashboard from './pages/EventsDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes></Routes>
    </Router>
  );
};

export default App;

{
  /* <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<EventsDashboard />} /> */
}
