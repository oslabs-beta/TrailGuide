import { useEffect, useState } from 'react';
import { Bar, BarChart, LabelList, YAxis } from 'recharts';
import { CountedEvent } from '../../types';

export default function EventSourceChart() {
  const [events, setEvents] = useState<CountedEvent[]>([]);

  useEffect(() => {
    fetch('/events?countOn=name')
      .then((response) => response.json())
      .then((data: CountedEvent[] | { err: string }) => {
        if (!Object.prototype.hasOwnProperty.call(Object, 'err'))
          setEvents(() => data as CountedEvent[]);
      })
      .catch((error) =>
        console.warn('Could not fetch event name counts: ' + error)
      );
  }, []);

  return (
    <BarChart width={400} height={340} data={events} layout="vertical">
      <YAxis dataKey="EventSource" type="category" width={200} />
      {/* <XAxis /> */}
      <Bar dataKey="count" maxBarSize={30} fill="#000090">
        <LabelList dataKey="count" position="insideLeft" fill="#F0F0F0" />
      </Bar>
    </BarChart>
  );
}
