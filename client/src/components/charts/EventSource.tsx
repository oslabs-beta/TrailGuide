import { useEffect, useState } from 'react';
import { getEvents } from '../../aws/getEvents';
import { Bar, BarChart, LabelList, XAxis, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6666', '#FF99CC', '#FFCC99'];

export default function EventSourceChart() {
  const [events, setEvents] = useState<{ EventSource: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventSource, setSelectedEventSource] = useState<string | null>(null); // State for clicked event source

  useEffect(() => {
    async function updateEvents(): Promise<void> {
      setLoading(true);
      const newEvents = await getEvents(50);
      const eventCounts: Record<string, number> = newEvents.reduce(
        (counts: Record<string, number>, { EventSource }) => ({
          ...counts,
          [EventSource ?? 'noEventName']: (counts[EventSource ?? 'noEventName'] || 0) + 1,
        }),
        {}
      );
      delete eventCounts.noEventName;
      setEvents(
        Object.entries(eventCounts).map(([EventSource, count]) => ({
          EventSource: EventSource.replace(/([A-Z])/g, ' $1'),
          count,
        }))
      );
      setLoading(false);
    }
    void updateEvents();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  const handleClick = (data: { EventSource: string }) => {
    setSelectedEventSource((prevSelected) =>
      prevSelected === data.EventSource ? null : data.EventSource
    );
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <BarChart
        width={events.length * 120}
        height={300}
        data={events}
        layout="horizontal"
        barCategoryGap="1%"
        barGap={1}
      >
        <XAxis dataKey="count" type="category" interval={0} angle={-30} textAnchor="end" />
        <Bar dataKey="count" maxBarSize={35} minPointSize={5}>
          {events.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              onClick={() => handleClick(entry)} // Attach the click handler to each Cell
              style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickability
            />
          ))}
          <LabelList className='chartlabel'
            dataKey="EventSource"
            position="insideBottom"
            angle={90}
            fill="#000000"
          />
        </Bar>
      </BarChart>

      {/* Display selected event source under the chart title */}
      {selectedEventSource && (
        <p className='underchart'>
          Event Source: {selectedEventSource}
        </p>
      )}
    </div>
  );
}
