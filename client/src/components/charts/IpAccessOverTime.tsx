import { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Line } from 'recharts';

import getIpTimes, { bucketByMinute } from '../../aws/getIpTimes';

import { TimeCount } from '../../types';

export default function IpAccessOverTimeChart({
  currentIp,
}: {
  currentIp?: string;
}): JSX.Element | undefined {
  const [ipTimes, setIpTimes] = useState<TimeCount[]>([]);

  useEffect(() => {
    async function updateIpTimes() {
      if (!currentIp) setIpTimes(() => []);
      else {
        const newData = await getIpTimes(currentIp, bucketByMinute);
        setIpTimes(() => newData);
      }
    }
    void updateIpTimes();
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
