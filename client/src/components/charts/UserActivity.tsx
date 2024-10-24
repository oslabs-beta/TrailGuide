import React, { useState, useEffect } from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  Legend,
  Tooltip,
} from 'recharts';
import { CountedEvent } from '../../types';

const UserActivityChart: React.FC = () => {
  const [data, setData] = useState<CountedEvent[]>([]);

  useEffect(() => {
    fetch('/events?countOn=time&groupTimeBy=minute')
      .then((response) => response.json())
      .then((data: CountedEvent[] | { err: string }) => {
        if (!Object.prototype.hasOwnProperty.call(Object, 'err'))
          setData(() => data as CountedEvent[]);
      })
      .catch((error) =>
        console.warn('Could not fetch event time counts: ', error)
      );
  }, []);

  return (
    <AreaChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="localTime" scale="time" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area
        type="monotone"
        dataKey="count"
        stroke="#8884d8"
        fill="#82ca9d"
        activeDot={{ r: 8 }}
      />
    </AreaChart>
  );
};

export default UserActivityChart;
