import React from 'react';
import Card from '../components/Card';
import UserActivityChart from '../components/charts/LineChart';
import TestPieChart from '../components/charts/PieChart';
import HeatMap from '../components/charts/HeatMap';
import AccessPerIpChart from '../components/charts/AccessByIp';

const Home: React.FC = () => (
  <main>
    <Card title="Important Data. Very Important">
      <TestPieChart />
    </Card>
    <Card title="Real User Data. I Promise">
      <UserActivityChart />
    </Card>
    <Card title="Test Heat Map">
      <HeatMap />
    </Card>
    <Card title="Access by Ip Address">
      <AccessPerIpChart />
    </Card>
  </main>
);

export default Home;
