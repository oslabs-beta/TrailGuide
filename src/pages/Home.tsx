import React from 'react';
import Card from '../components/Card';
import UserActivityChart from '../components/charts/LineChart';
import TestPieChart from '../components/charts/PieChart';
import HeatMap from '../components/charts/HeatMap';

const Home: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div>
    <Card title="Important Data. Very Important" isDarkMode={isDarkMode}>
      <TestPieChart />
    </Card>
    <Card title="Real User Data. I Promise" isDarkMode={isDarkMode}>
      <UserActivityChart />
    </Card>
    <Card title="Test Heat Map" isDarkMode={isDarkMode}>
      <HeatMap />
    </Card>
  </div>
);

export default Home;
