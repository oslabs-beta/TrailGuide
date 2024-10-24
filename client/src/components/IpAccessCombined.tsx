import { useState, useEffect } from 'react';
import AccessPerIpChart from './charts/AccessPerIp';
import IpAccessOverTimeChart from './charts/IpAccessOverTime';
import { getIpCounts } from '../aws/getIpCounts';
import { IpLocCount, IpAccessCombinedProps } from '../types'; // Import the interface from types.ts

export default function IpAccessCombined({
  currentIp,
  setCurrentIp,
}: IpAccessCombinedProps): JSX.Element {
  const [ipLocCounts, setIpLocCounts] = useState<IpLocCount[]>([]);

  useEffect(() => {
    async function updateIpLocCounts(): Promise<void> {
      const newData = await getIpCounts();
      setIpLocCounts(() => newData);
    }
    void updateIpLocCounts();
  }, []);
  

  const currentIpLoc = ipLocCounts.find(({ ip }) => ip === currentIp);

  return (
    <>
      <div>
        <AccessPerIpChart
          currentIp={currentIp}
          setCurrentIp={setCurrentIp}
          ipLocCounts={ipLocCounts}
        />
        {currentIp && (
          <>
            <p>
              <strong>Location: </strong>
              {currentIpLoc?.city}, {currentIpLoc?.region},{' '}
              {currentIpLoc?.country}
            </p>
            {/* Make sure the chart renders only when IP is selected */}
            <IpAccessOverTimeChart currentIp={currentIp} />
          </>
        )}
      </div>
    </>
  );  
}
