import { useEffect, useState } from 'react';
import { getEvents } from '../../aws/getEvents';
import { Bar, BarChart, LabelList, YAxis, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6666', '#FF99CC', '#FFCC99'];

export default function EventSourceChart() {
  const [events, setEvents] = useState<
    { EventSource: string; count: number }[]
  >([]);

  useEffect(() => {
    async function updateEvents(): Promise<void> {
      const newEvents = await getEvents(50);
      // count the time of each EventSource
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
      <YAxis dataKey="EventSource" type="category" width={250} />
      <Bar dataKey="count" maxBarSize={25} minPointSize={5} fill="#000090">
        {/* Map through events and assign different colors to each bar */}
        {events.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
        <LabelList dataKey="count" position="insideLeft" fill="#F0F0F0" />
      </Bar>
    </BarChart>
  );
}
