import { useState, useEffect } from 'react';
import { AreaChart, XAxis, YAxis, Area } from 'recharts';
import getIpTimes, { bucketByMinute } from '../../aws/getIpTimes';
import { TimeCount } from '../../types';

export default function IpAccessOverTimeChart({
  currentIp,
}: {
  currentIp?: string;
}): JSX.Element | null {
  const [ipTimes, setIpTimes] = useState<TimeCount[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function updateIpTimes() {
      setLoading(true); // Set loading to true before fetching data
      if (!currentIp) {
        setIpTimes([]);
        setLoading(false); // Set loading to false if no IP is selected
      } else {
        const newData = await getIpTimes(currentIp, bucketByMinute);
        setIpTimes(newData);
        setLoading(false); // Set loading to false after data is ready
      }
    }
    updateIpTimes().catch((error) => {
      console.error('Failed to update IP times:', error);
      setLoading(false); // Handle errors by stopping loading
    });

    console.log('currentIp:', currentIp);
  }, [currentIp]);

  if (!currentIp) return null;

  // Show loading message while data is being fetched
  if (loading) return <p>Loading chart...</p>;

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
