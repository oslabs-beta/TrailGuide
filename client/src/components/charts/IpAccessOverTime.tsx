import { useState, useEffect } from 'react';
import { AreaChart, XAxis, YAxis, Area } from 'recharts';
import { CountedEvent } from '../../types';

export default function IpAccessOverTimeChart({
  currentIp,
}: {
  currentIp?: string;
}): JSX.Element | null {
  const [ipTimes, setIpTimes] = useState<CountedEvent[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetch('/events?countOn=time&groupTimeBy=minute')
      .then((response) => response.json())
      .then((data: CountedEvent[] | { err: string }) => {
        if (!Object.prototype.hasOwnProperty.call(Object, 'err'))
          setIpTimes(() => data as CountedEvent[]);
        setLoading(false); // Set loading to true before fetching data
      })
      .catch((error) =>
        console.warn('IpAccessOverTime: fetch error: ' + error)
      );
  }, [currentIp]);

  if (!currentIp) return null; // Return null instead of undefined
  if (loading) return <p>Loading chart...</p>;
  //reversed the times to show the most recent first
  return (
    <AreaChart width={300} height={300} data={ipTimes}>
      <XAxis dataKey="localTime" reversed={true} />
      <YAxis />
      <Area
        type="monotone"
        dataKey="count"
        stroke="#8884d8" // Line color
        fill="#8884d8" // Area fill color
        dot={false}
      />
    </AreaChart>
  );
}
