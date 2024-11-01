import { useEffect, useState } from 'react';
import { Bar, BarChart, LabelList, XAxis, Cell } from 'recharts';
import { CountedEvent } from '../../types';

// Define an array of colors to be used for the bars in the chart
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
 * EventTypeChart component displays a bar chart of event counts fetched from the server.
 * It allows users to select an event by clicking on a bar, and displays the selected event name.
 *
 * @component
 * @example
 * return (
 *   <EventTypeChart />
 * )
 *
 * @returns {JSX.Element} The rendered bar chart component.
 *
 * @remarks
 * - The component fetches event data from the server when it mounts.
 * - It displays a loading message while the data is being fetched.
 * - Event names are formatted by adding spaces before capital letters.
 * - The chart's width is dynamically adjusted based on the number of events.
 * - Clicking on a bar toggles the selection of an event.
 *
 * @typedef {Object} CountedEvent - The structure of an event data object.
 * @property {string} name - The name of the event.
 * @property {number} count - The count of the event.
 *
 * @typedef {Object} EventData
 * @property {string} name - The name of the event.
 *
 * @typedef {Object} FetchError
 * @property {string} err - The error message.
 */
export default function EventTypeChart() {
  // State to store the fetched events data
  const [events, setEvents] = useState<CountedEvent[]>([]);
  // State to manage the loading state
  const [loading, setLoading] = useState(true);
  // State to store the name of the selected event
  const [selectedEventName, setSelectedEventName] = useState<string | null>(
    null
  );

  // Fetch the events data when the component mounts
  useEffect(() => {
    setLoading(true);
    fetch('/events?countOn=name')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: CountedEvent[] | { err: string }) => {
        // Format the event names by adding spaces before capital letters
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

  // Display a loading message while the data is being fetched
  if (loading) return <p>Loading chart...</p>;

  // Handle click event on a bar to toggle the selection of an event
  const handleClick = (data: { name: string }) => {
    setSelectedEventName((prevSelected) =>
      prevSelected === data.name ? null : data.name
    );
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <BarChart
        width={events.length * 120} // Dynamic width based on the number of events
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
              fill={COLORS[index % COLORS.length]} // Assign color to each bar
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
