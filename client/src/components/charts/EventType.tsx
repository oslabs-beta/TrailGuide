import { useEffect, useState } from 'react';
import { getEvents } from '../../aws/getEvents';
import { Bar, BarChart, LabelList, YAxis } from 'recharts';

export default function EventTypeChart() {
  const [events, setEvents] = useState<{ EventName: string; count: number }[]>(
    []
  );

  useEffect(() => {
    async function updateEvents(): Promise<void> {
      const newEvents = await getEvents(15);
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
      <YAxis dataKey="EventName" type="category" width={150} />
      {/* <XAxis /> */}
      <Bar dataKey="count" maxBarSize={30} fill="#00C030">
        <LabelList dataKey="count" position="insideLeft" fill="#F0F0F0" />
      </Bar>
    </BarChart>
  );
}
