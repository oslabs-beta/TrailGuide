import React, { useState, useEffect } from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  Tooltip,
} from 'recharts';
import { SimplifiedEvent } from '../../types';

const UserActivityChart: React.FC = () => {
  const [data, setData] = useState<SimplifiedEvent[]>([]);

  useEffect(() => {
    fetch('/events?countOn=time&groupTimeBy=minute')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: { time: string; count: number }[]) =>
        setData(
          (data as { time: string; count: number }[]).map((event) => ({
            localTime: new Date(event.time).toLocaleString(),
            count: event.count,
          }))
        )
      )
      .catch((error) =>
        console.warn('Could not fetch event time counts: ', error)
      );
  }, []);

  // Format for the X-axis to display Mon, Tue, etc.
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayMonth = `${date.getMonth() + 1}/${date.getDate()}`;
    return `${day} ${dayMonth}`;
  };

  return (
    <AreaChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="localTime"
        tickFormatter={formatXAxis}
        reversed
        angle={-45}
        textAnchor="end"
      />
      <YAxis domain={[0, 50]} tickCount={6} />
      <Tooltip />
      <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#82ca9d" />
    </AreaChart>
  );
};

export default UserActivityChart;
