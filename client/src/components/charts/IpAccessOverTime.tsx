import { useState, useEffect } from 'react';
import { AreaChart, XAxis, YAxis, Area } from 'recharts';
import { CountedEvent } from '../../types';

// Component to display IP access over time chart
/**
 * Component to render an area chart displaying IP access over time.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.currentIp] - The current IP address to filter the data.
 * @returns {JSX.Element | null} The rendered area chart or null if no IP is provided.
 *
 * @component
 * @example
 * return (
 *   <IpAccessOverTimeChart currentIp="192.168.1.1" />
 * )
 *
 * @remarks
 * This component fetches data from the server and displays it in an area chart.
 * It shows a loading message while the data is being fetched.
 *
 * @function
 * @name IpAccessOverTimeChart
 */
export default function IpAccessOverTimeChart({
  currentIp,
}: {
  currentIp?: string;
}): JSX.Element | null {
  // State to store the fetched IP times data
  const [ipTimes, setIpTimes] = useState<CountedEvent[]>([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);

  // Effect to fetch data when the component mounts or currentIp changes
  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetch('/events?countOn=time&groupTimeBy=minute')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: CountedEvent[] | { err: string }) => {
        setIpTimes(() => data as CountedEvent[]); // Update state with fetched data
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) =>
        console.warn('IpAccessOverTime: fetch error: ' + error)
      );
  }, [currentIp]);

  // Return null if currentIp is not provided
  if (!currentIp) return null;
  // Display loading message while data is being fetched
  if (loading) return <p>Loading chart...</p>;

  // Render the AreaChart with the fetched data
  return (
    <AreaChart width={300} height={300} data={ipTimes}>
      <XAxis dataKey="localTime" reversed={true} /> {/* X-axis with reversed order to show the most recent first */}
      <YAxis /> {/* Y-axis */}
      <Area
        type="monotone"
        dataKey="count"
        stroke="#8884d8" // Line color
        fill="#8884d8" // Area fill color
        dot={false} // Disable dots on the line
      />
    </AreaChart>
  );
}
