import { useEffect, useState } from 'react';
import { getEvents } from '../../aws/getEvents';
import { Bar, BarChart, Tooltip, YAxis } from 'recharts';

export default function EventTypeChart() {
  const [events, setEvents] = useState<{ EventName: string; count: number }[]>(
    []
  );

  useEffect(() => {
    async function updateEvents(): Promise<void> {
      const newEvents = await getEvents();
      // count the time of each EventName
      const eventCounts: Record<string, number> = newEvents.reduce(
        (counts: Record<string, number>, { EventName }) => ({
          ...counts,
          [EventName ?? 'noEventName']:
            (counts[EventName ?? 'noEventName'] || 0) + 1,
        }),
        {} // initial value of counts (for reduce)
      );
      // remove bad data
      delete eventCounts.noEventName;
      // reshape data for recharts
      setEvents(() =>
        Object.entries(eventCounts).map(([EventName, count]) => ({
          EventName: EventName.replace(/([A-Z])/g, ' $1'),
          count,
        }))
      );
    }
    void updateEvents();
  }, []);

  return (
    <BarChart width={400} height={340} data={events} layout="vertical">
      <YAxis dataKey="EventName" type="category" width={100} />
      {/* <XAxis /> */}
      <Bar dataKey="count" fill="#00CC10" />
      <Tooltip />
    </BarChart>
  );
}
