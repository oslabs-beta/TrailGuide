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
import { getEvents } from '../../aws/getEvents';
import { bucketByMinute } from '../../aws/getIpTimes';

interface UserActivityData {
  EventTime: string; // can change to date? depending on the data
  count: number;
}

//TODO: implement auto-update with current data
// const initialData: UserActivityData[] = [
//   { timestamp: '2024-10-01', activityCount: 30 },
//   { timestamp: '2024-10-02', activityCount: 50 },
//   { timestamp: '2024-10-03', activityCount: 20 },
//   { timestamp: '2024-10-04', activityCount: 100 },
//   { timestamp: '2024-10-05', activityCount: 60 },
//   { timestamp: '2024-10-06', activityCount: 70 },
//   { timestamp: '2024-10-07', activityCount: 90 },
// ];

const UserActivityChart: React.FC = () => {
  const [data, setData] = useState<UserActivityData[]>([]);

  //effect for simulating updates
  useEffect(() => {
    async function updateEvents(): Promise<void> {
      const newEvents = await getEvents(30);
      // count the time of each EventName
      const eventCounts: Record<string, number> = newEvents.reduce(
        (counts: Record<string, number>, { EventTime }) => {
          if (!EventTime) return { noEventTime: 0 };
          const time = bucketByMinute(EventTime).toLocaleTimeString();
          return {
            ...counts,
            [time]: (counts[time] || 0) + 1,
          };
        },
        {} // initial value of counts (for reduce)
      );
      // remove bad data
      delete eventCounts.noEventTime;
      // reshape data for recharts
      setData(() =>
        Object.entries(eventCounts).map(([EventTime, count]) => ({
          EventTime: EventTime.replace(/([A-Z])/g, ' $1'),
          count,
        }))
      );
    }
    void updateEvents();
  }, []);

  return (
    <AreaChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="EventTime" />
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
