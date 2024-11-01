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

/**
 * UserActivityChart is a React functional component that renders an area chart
 * displaying user activity over time. It fetches event data from the server,
 * processes it, and displays it as an area chart using the Recharts library.
 *
 * @component
 * @example
 * return (
 *   <UserActivityChart />
 * )
 *
 * @returns {JSX.Element} The rendered area chart component.
 *
 * @remarks
 * The component fetches event data from the server endpoint '/events?countOn=time&groupTimeBy=minute'.
 * The data is expected to be an array of objects with 'time' and 'count' properties.
 * The 'time' property is converted to a local time string and stored in the component's state.
 *
 * The X-axis of the chart is formatted to display the day of the week and the month/day.
 * The Y-axis is limited to a domain of [0, 50] with 6 ticks.
 *
 * @function
 * @name UserActivityChart
 */
const UserActivityChart: React.FC = (): JSX.Element => {
  // State to hold the fetched event data
  const [data, setData] = useState<SimplifiedEvent[]>([]);

  useEffect(() => {
    fetch('/events?countOn=time&groupTimeBy=minute')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: { time: string; count: number }[]) =>
        // Map the fetched data to the desired format and update the state
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
      {/* Grid lines for the chart */}
      <CartesianGrid strokeDasharray="3 3" />
      {/* X-axis configuration */}
      <XAxis
        dataKey="localTime"
        tickFormatter={formatXAxis}
        reversed
        angle={-45}
        textAnchor="end"
      />
      {/* Y-axis configuration */}
      <YAxis domain={[0, 50]} tickCount={6} />
      {/* Tooltip to show data on hover */}
      <Tooltip />
      {/* Area chart configuration */}
      <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#82ca9d" />
    </AreaChart>
  );
};

export default UserActivityChart;
