import React, { useState, useEffect } from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
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
          setData(
            (data as CountedEvent[]).map((countedEvent) => ({
              ...countedEvent,
              localTime: new Date(countedEvent.time).toLocaleString(),
            }))
          );
      })
      .catch((error) =>
        console.warn('Could not fetch event time counts: ', error)
      );
  }, []);
  //reversed the times to show the most recent first
  return (
    <AreaChart width={600} height={300} data={data} margin={{top: -100, left: -5, right:5, bottom:50}}>
      <CartesianGrid strokeDasharray={"3 3"} />
      <XAxis dataKey="localTime" reversed angle={-45} textAnchor="end" />
      <YAxis domain={[0, 'dataMax + 11']}/>
      <Tooltip />
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
