import { useState, useEffect, lazy } from 'react';

import { CountedEvent, IPLocation } from '../types';

const AccessPerIpChart = lazy(() => import('./charts/AccessPerIp'));
const IpAccessOverTimeChart = lazy(() => import('./charts/IpAccessOverTime'));

export default function IpAccessCombined(): JSX.Element {
  const [currentIp, setCurrentIp] = useState<string | undefined>();
  const [ipLocCounts, setIpLocCounts] = useState<(IPLocation & CountedEvent)[]>(
    []
  );

  useEffect(() => {
    fetch('/events?countOn=source_ip&includeLocation=true')
      .then((response) => response.json())
      .then((data: (IPLocation & CountedEvent)[] | { err: string }) => {
        if (!Object.prototype.hasOwnProperty.call(Object, 'err'))
          setIpLocCounts(() => data as (IPLocation & CountedEvent)[]);
      })
      .catch((error) =>
        console.warn('IpAccessCombined: fetch error: ' + error)
      );
  }, []);

  const currentIpLoc = ipLocCounts.find(
    ({ source_ip }) => source_ip === currentIp
  );

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
