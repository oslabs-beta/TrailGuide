import { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Line } from 'recharts';
import { CountedEvent } from '../../types';

export default function IpAccessOverTimeChart({
  currentIp,
}: {
  currentIp?: string;
}): JSX.Element | undefined {
  const [ipTimes, setIpTimes] = useState<CountedEvent[]>([]);

  useEffect(() => {
    fetch('/events?countOn=time&groupTimeBy=minute')
      .then((response) => response.json())
      .then((data: CountedEvent[] | { err: string }) => {
        if (!Object.prototype.hasOwnProperty.call(Object, 'err'))
          setIpTimes(() => data as CountedEvent[]);
      })
      .catch((error) =>
        console.warn('IpAccessOverTime: fetch error: ' + error)
      );
  }, [currentIp]);

  if (!currentIp) return;
  return (
    <LineChart width={700} height={400} data={ipTimes}>
      <XAxis dataKey="localTime" />
      <YAxis />
      <Line type="monotoneX" dataKey="count" dot={false} />
    </LineChart>
  );
}
