import { useState, useEffect } from 'react';
import AccessPerIpChart from './charts/AccessPerIp';
import IpAccessOverTimeChart from './charts/IpAccessOverTime';
import { CountedEvent, IPLocation, IpAccessCombinedProps } from '../types'; 

/**
 * IpAccessCombined component fetches and displays IP location counts and details for a selected IP.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.currentIp - The currently selected IP address.
 * @param {Function} props.setCurrentIp - Function to update the currently selected IP address.
 * @returns {JSX.Element} The rendered component.
 *
 * @typedef {Object} IPLocation
 * @property {string} city - The city of the IP location.
 * @property {string} region - The region of the IP location.
 * @property {string} country - The country of the IP location.
 * @property {string} source_ip - The source IP address.
 *
 * @typedef {Object} CountedEvent
 * @property {number} count - The count of events for the IP.
 *
 * @typedef {Object} IpAccessCombinedProps
 * @property {string} currentIp - The currently selected IP address.
 * @property {Function} setCurrentIp - Function to update the currently selected IP address.
 *
 * @typedef {IPLocation & CountedEvent} IPLocationCountedEvent
 *
 * @example
 * <IpAccessCombined currentIp="192.168.1.1" setCurrentIp={setIp} />
 */
export default function IpAccessCombined({
  currentIp,
  setCurrentIp,
}: IpAccessCombinedProps): JSX.Element {
  // State to hold the IP location counts
  const [ipLocCounts, setIpLocCounts] = useState<(IPLocation & CountedEvent)[]>(
    []
  );

  // Fetch IP location counts when the component mounts
  useEffect(() => {
    fetch('/events?countOn=source_ip&includeLocation=true')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: (IPLocation & CountedEvent)[] | { err: string }) =>
        setIpLocCounts(() => data as (IPLocation & CountedEvent)[])
      )
      .catch((error) =>
        console.warn('IpAccessCombined: fetch error: ' + error)
      );
  }, []);

  // Find the location details of the current IP
  const currentIpLoc = ipLocCounts.find(
    ({ source_ip }) => source_ip === currentIp
  );

  return (
    <>
      <div>
        {/* Render the AccessPerIpChart component */}
        <AccessPerIpChart
          currentIp={currentIp}
          setCurrentIp={setCurrentIp}
          ipLocCounts={ipLocCounts}
        />
        {currentIp && (
          <>
            {/* Display the location details of the current IP */}
            <p>
              <strong>Location: </strong>
              {currentIpLoc?.city}, {currentIpLoc?.region},{' '}
              {currentIpLoc?.country}
            </p>
            {/* TODO: Render the IpAccessOverTimeChart component only when an IP is selected//possible display styling issue */}
            <IpAccessOverTimeChart currentIp={currentIp} />
          </>
        )}
      </div>
    </>
  );
}
