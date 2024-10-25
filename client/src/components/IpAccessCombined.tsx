import { useState, useEffect } from 'react';
import AccessPerIpChart from './charts/AccessPerIp';
import IpAccessOverTimeChart from './charts/IpAccessOverTime';
import { CountedEvent, IPLocation, IpAccessCombinedProps } from '../types'; // Import the interface from types.ts

export default function IpAccessCombined({
  currentIp,
  setCurrentIp,
}: IpAccessCombinedProps): JSX.Element {
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
            {/* Make sure the chart renders only when IP is selected */}
            <IpAccessOverTimeChart currentIp={currentIp} />
          </>
        )}
      </div>
    </>
  );
}
