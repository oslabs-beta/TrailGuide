import { useEffect, useState } from 'react';
import { getEvents } from '../../aws/getEvents';
import { Bar, BarChart, LabelList, XAxis, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6666', '#FF99CC', '#FFCC99'];

export default function EventTypeChart() {
  const [events, setEvents] = useState<{ EventName: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null); // State for clicked event name

  useEffect(() => {
    async function updateEvents(): Promise<void> {
      setLoading(true);
      const newEvents = await getEvents(50);
      const eventCounts: Record<string, number> = newEvents.reduce(
        (counts: Record<string, number>, { EventName }) => ({
          ...counts,
          [EventName ?? 'noEventName']: (counts[EventName ?? 'noEventName'] || 0) + 1,
        }),
        {}
      );
      delete eventCounts.noEventName;
      setEvents(
        Object.entries(eventCounts).map(([EventName, count]) => ({
          EventName: EventName.replace(/([A-Z])/g, ' $1'),
          count,
        }))
      );
      setLoading(false);
    }
    void updateEvents();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  const handleClick = (data: { EventName: string }) => {
    // Toggle selection: if already selected, deselect; otherwise, select
    setSelectedEventName((prevSelected) => (prevSelected === data.EventName ? null : data.EventName));
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <BarChart
        width={events.length * 120}
        height={300}
        data={events}
        layout="horizontal"
        barCategoryGap="1%" // Decrease gap between bars
        barGap={1}
      >
        <XAxis dataKey="count" type="category" interval={0} angle={-30} textAnchor="end" />
        <Bar
          dataKey="count"
          maxBarSize={35}
          minPointSize={5} 
        >
          {events.map((data, index) => (
            <Cell key={`cell-${index}`} onClick={() => handleClick(data)} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList className='chartlabel'
            dataKey="EventName"
            position="insideBottom"
            angle={90}
            fill="#000000"
            dx={20}
          />
        </Bar>
      </BarChart>

      {/* Display selected event name under the chart title */}
      {selectedEventName && (
        <p className='underchart' >
          Selected Event: {selectedEventName}
        </p>
      )}
    </div>
  );
}
