import { useState, lazy } from 'react';

const AccessPerIpChart = lazy(() => import('./charts/AccessPerIp'));
const IpAccessOverTimeChart = lazy(() => import('./charts/IpAccessOverTime'));

export default function IpAccessCombined(): JSX.Element {
  const [currentIp, setCurrentIp] = useState<string | undefined>();
  return (
    <>
      <AccessPerIpChart currentIp={currentIp} setCurrentIp={setCurrentIp} />
      <IpAccessOverTimeChart currentIp={currentIp} />
    </>
  );
}
