import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import TestPieChart from './components/charts/PieChart.tsx';
//import Home from './pages/Home';
//import Profile from './pages/Profile';
//import EventsDashboard from './pages/EventsDashboard';


const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div>
        <h1>Important Data. Very Important</h1>
        <TestPieChart />
      </div>
      <Routes>
        
      </Routes>
    </Router>
  );
};

export default App;

{/* <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<EventsDashboard />} /> */}