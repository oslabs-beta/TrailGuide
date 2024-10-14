import React from "react";
import Card from "../components/Card";
import UserActivityChart from "../components/charts/LineChart";
import TestPieChart from "../components/charts/PieChart";



const Home: React.FC = () =>
(<div>
  <Card title='Important Data. Very Important'>
    <TestPieChart />
  </Card>
  <Card title='Real User Data. I Promise'>
    <UserActivityChart />
  </Card>
</div>);

export default Home;