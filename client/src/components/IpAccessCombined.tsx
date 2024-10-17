import { useState } from 'react';
import AccessPerIpChart from './charts/AccessPerIp';
import IpAccessOverTimeChart from './charts/IpAccessOverTime';

export default function IpAccessCombined(): JSX.Element {
  const [currentIp, setCurrentIp] = useState<string | undefined>();
  return (
    <>
      <AccessPerIpChart currentIp={currentIp} setCurrentIp={setCurrentIp} />
      <IpAccessOverTimeChart currentIp={currentIp} />
    </>
  );
}
