import { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Line } from 'recharts';

import getIpTimes, { bucketByMinute } from '../../aws/getIpTimes';

import { TimeCount } from '../../types';

export default function IpAccessOverTimeChart({
  currentIp,
}: {
  currentIp?: string;
}): JSX.Element | null { // Update to return null instead of undefined
  const [ipTimes, setIpTimes] = useState<TimeCount[]>([]);

  useEffect(() => {
    async function updateIpTimes() {
      if (!currentIp) {
        setIpTimes([]);
      } else {
        const newData = await getIpTimes(currentIp, bucketByMinute);
        setIpTimes(newData);
      }
    }
    updateIpTimes().catch((error) => {
      console.error('Failed to update IP times:', error);
    });


    console.log('currentIp:', currentIp);
  }, [currentIp]);

  if (!currentIp) return null; // Return null instead of undefined
//reversed the times to show the most recent first
  return (
    <LineChart width={700} height={400} data={ipTimes}>
      <XAxis dataKey="localTime" reversed={true} />
      <YAxis />
      <Line type="monotoneX" dataKey="count" dot={false} />
    </LineChart>
  );
}
