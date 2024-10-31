import { useEffect, useState } from 'react';
import { Bar, BarChart, LabelList, XAxis, Cell } from 'recharts';
import { CountedEvent } from '../../types';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF6666',
  '#FF99CC',
  '#FFCC99',
];

export default function EventTypeChart() {
  const [events, setEvents] = useState<CountedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(
    null
  ); // State for clicked event name

  useEffect(() => {
    setLoading(true);
    fetch('/events?countOn=name')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: CountedEvent[] | { err: string }) => {
        setEvents(
          (data as CountedEvent[]).map((event) => ({
            ...event,
            name: event.name.replace(/([A-Z])/g, ' $1'),
          }))
        );
        setLoading(false);
      })
      .catch((error) =>
        console.warn('Could not fetch event name counts: ', error)
      );
  }, []);

  if (loading) return <p>Loading chart...</p>;

  const handleClick = (data: { name: string }) => {
    // Toggle selection: if already selected, deselect; otherwise, select
    setSelectedEventName((prevSelected) =>
      prevSelected === data.name ? null : data.name
    );
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
        <XAxis
          dataKey="count"
          type="category"
          interval={0}
          angle={-30}
          textAnchor="end"
        />
        <Bar
          dataKey="count"
          maxBarSize={35}
          minPointSize={5}
          style={{ cursor: 'pointer' }}
        >
          {events.map((data, index) => (
            <Cell
              key={`cell-${index}`}
              onClick={() => handleClick(data)}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
          <LabelList
            className="chartlabel"
            dataKey="name"
            position="insideBottom"
            angle={90}
            fill="#000000"
            dx={20}
            dy={-100}
          />
        </Bar>
      </BarChart>

      {/* Display selected event name under the chart title */}
      {selectedEventName && (
        <p className="underchart">Selected Event: {selectedEventName}</p>
      )}
    </div>
  );
}
