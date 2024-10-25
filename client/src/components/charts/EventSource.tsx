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

export default function EventSourceChart() {
  const [events, setEvents] = useState<CountedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventSource, setSelectedEventSource] = useState<string | null>(
    null
  ); // State for clicked event source

  useEffect(() => {
    setLoading(true);
    fetch('/events?countOn=source')
      .then((response) => response.json())
      .then((data: CountedEvent[] | { err: string }) => {
        if (!Object.prototype.hasOwnProperty.call(Object, 'err'))
          setEvents(data as CountedEvent[]);
        setLoading(false);
      })
      .catch((error) =>
        console.warn('Could not fetch event name counts: ' + error)
      );
  }, []);

  if (loading) return <p>Loading chart...</p>;

  const handleClick = (source: string) => {
    setSelectedEventSource((prevSelected) =>
      prevSelected === source ? null : source
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
        <XAxis
          dataKey="count"
          type="category"
          interval={0}
          angle={-30}
          textAnchor="end"
        />
        <Bar dataKey="count" maxBarSize={35} minPointSize={5}>
          {events.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              onClick={() => handleClick(entry.source)} // Attach the click handler to each Cell
              style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickability
            />
          ))}
          <LabelList
            className="chartlabel"
            dataKey="EventSource"
            position="insideBottom"
            angle={90}
            fill="#000000"
          />
        </Bar>
      </BarChart>

      {/* Display selected event source under the chart title */}
      {selectedEventSource && (
        <p className="underchart">Event Source: {selectedEventSource}</p>
      )}
    </div>
  );
}
