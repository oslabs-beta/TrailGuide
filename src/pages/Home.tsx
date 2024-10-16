import React from 'react';
import Card from '../components/Card';
//import UserActivityChart from '../components/charts/LineChart';
//import TestPieChart from '../components/charts/PieChart';
import HeatMap from '../components/charts/HeatMap';
import IpAccessCombined from '../components/IpAccessCombined';

const Home: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <main className="main">
    <Card isDarkMode={isDarkMode} title="ACCESS BY IP ADDRESS">
    <IpAccessCombined />
    </Card>
    <Card title="IP ORIGIN MAP" isDarkMode={isDarkMode}>
      <HeatMap />
    </Card>
  </main>
);

export default Home;

{/* <Card title="Important Data. Very Important" isDarkMode={isDarkMode}>
      <TestPieChart />
    </Card>
    <Card title="Real User Data. I Promise" isDarkMode={isDarkMode}>
      <UserActivityChart />
    </Card> */}
