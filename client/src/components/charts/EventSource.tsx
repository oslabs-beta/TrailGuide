import { useEffect, useState } from 'react';
import { getEvents } from '../../aws/getEvents';
import { Bar, BarChart, LabelList, YAxis } from 'recharts';

export default function EventSourceChart() {
  const [events, setEvents] = useState<
    { EventSource: string; count: number }[]
  >([]);

  useEffect(() => {
    async function updateEvents(): Promise<void> {
      const newEvents = await getEvents(30);
      // count the time of each EventName
      const eventCounts: Record<string, number> = newEvents.reduce(
        (counts: Record<string, number>, { EventSource }) => ({
          ...counts,
          [EventSource ?? 'noEventName']:
            (counts[EventSource ?? 'noEventName'] || 0) + 1,
        }),
        {} // initial value of counts (for reduce)
      );
      // remove bad data
      delete eventCounts.noEventName;
      // reshape data for recharts
      setEvents(() =>
        Object.entries(eventCounts).map(([EventSource, count]) => ({
          EventSource: EventSource.replace(/([A-Z])/g, ' $1'),
          count,
        }))
      );
    }
    void updateEvents();
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
