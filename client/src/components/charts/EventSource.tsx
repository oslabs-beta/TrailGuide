import { useEffect, useState } from 'react';
import { Bar, BarChart, LabelList, XAxis, Cell } from 'recharts';
import { CountedEvent } from '../../types';

// Array of colors for the chart
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF6666',
  '#FF99CC',
  '#FFCC99',
];

/**
 * EventSourceChart component renders a bar chart of event sources.
 * 
 * @component
 * @example
 * return (
 *   <EventSourceChart />
 * )
 * 
 * @returns {JSX.Element} The rendered bar chart component.
 * 
 * @remarks
 * This component fetches event data from the server and displays it in a bar chart.
 * It also allows users to click on a bar to select an event source, which is displayed below the chart.
 * 
 * @typedef {Object} CountedEvent
 * @property {string} source - The source of the event.
 * @property {number} count - The count of events from this source.
 * 
 * @state {CountedEvent[]} events - The fetched events data.
 * @state {boolean} loading - The loading status of the data fetch.
 * @state {string | null} selectedEventSource - The selected event source when a bar is clicked.
 * 
 * @hook {useEffect} Fetches events data on component mount.
 * 
 * @function handleClick
 * @description Handles click event on a bar to toggle the selected event source.
 * @param {string} source - The source of the event that was clicked.
 */
export default function EventSourceChart() {
  // State to store the fetched events data
  const [events, setEvents] = useState<CountedEvent[]>([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to manage the selected event source when a bar is clicked
  const [selectedEventSource, setSelectedEventSource] = useState<string | null>(
    null
  );

  // Fetch events data on component mount
  useEffect(() => {
    setLoading(true);
    fetch('/events?countOn=source')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: CountedEvent[] | { err: string }) => {
        setEvents(data as CountedEvent[]);
        setLoading(false);
      })
      .catch((error) =>
        console.warn('Could not fetch event name counts: ' + error)
      );
  }, []);

  // Display loading message while data is being fetched
  if (loading) return <p>Loading chart...</p>;

  // Handle click event on a bar to toggle the selected event source
  const handleClick = (source: string) => {
    setSelectedEventSource((prevSelected) =>
      prevSelected === source ? null : source
    );
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <BarChart
        width={events.length * 120} // Dynamic width based on the number of events
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
              fill={COLORS[index % COLORS.length]} // Assign color from the COLORS array
              onClick={() => handleClick(entry.source)} // Attach the click handler to each Cell
              style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickability
            />
          ))}
          <LabelList
            className="chartlabel"
            dataKey="source"
            position="insideBottom"
            angle={90}
            fill="#000000"
            dx={20}
            dy={-110}
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
