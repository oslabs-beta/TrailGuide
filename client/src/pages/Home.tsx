import React, { lazy } from 'react';

const Card = lazy(() => import('../components/Card'));
const UserActivityChart = lazy(() => import('../components/charts/LineChart'));
const TestPieChart = lazy(() => import('../components/charts/PieChart'));
const HeatMap = lazy(() => import('../components/charts/HeatMap'));
const IpAccessCombined = lazy(() => import('../components/IpAccessCombined'));

const Home: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <main>
    <Card title="Important Data. Very Important" isDarkMode={isDarkMode}>
      <TestPieChart />
    </Card>
    <Card title="Real User Data. I Promise" isDarkMode={isDarkMode}>
      <UserActivityChart />
    </Card>
    <Card title="Test Heat Map" isDarkMode={isDarkMode}>
      <HeatMap />
    </Card>
    <Card isDarkMode={isDarkMode} title="Access by Ip Address">
      <IpAccessCombined />
    </Card>
  </main>
);

export default Home;
