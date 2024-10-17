import React, { lazy } from 'react';
import Card from '../components/Card';
import UserActivityChart from '../components/charts/LineChart';
import HeatMap from '../components/charts/HeatMap';
import IpAccessCombined from '../components/IpAccessCombined';
const EventTypeChart = lazy(() => import('../components/charts/EventType'));

const Home: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <main>
    <Card title="User Activity" isDarkMode={isDarkMode}>
      <UserActivityChart />
    </Card>
    <Card title="Event Types" isDarkMode={isDarkMode}>
      <EventTypeChart />
    </Card>
    <Card title="IP Address Heat Map" isDarkMode={isDarkMode}>
      <HeatMap />
    </Card>
    <Card isDarkMode={isDarkMode} title="Access by Ip Address">
      <IpAccessCombined />
    </Card>
  </main>
);

export default Home;
