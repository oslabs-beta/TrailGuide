import { useEffect, useState } from 'react';
import AccessPerIpChart from './charts/AccessPerIp';
import IpAccessOverTimeChart from './charts/IpAccessOverTime';
// import ObjectDisplay from './ObjDisplay';
import { getIpCounts } from '../aws/getIpCounts';
import { IpLocCount } from '../types';

export default function IpAccessCombined(): JSX.Element {
  const [currentIp, setCurrentIp] = useState<string | undefined>();
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
          </>
        )}
      </div>
      <IpAccessOverTimeChart currentIp={currentIp} />
    </>
  );
}
