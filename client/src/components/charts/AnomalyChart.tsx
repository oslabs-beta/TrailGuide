/**
 * This file renders a scatter chart component that visualizes anomalies detected in AWS CloudTrail data.
 * It uses components from the Recharts library to build an interactive and responsive chart.
 */

// Importing necessary components from Recharts for building the scatter chart
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/**
 * Represents a single data point for the scatter chart.
 * - `timestamp`: The date and time of the event, formatted as a string.
 * - `count`: The number of occurrences or events at the given timestamp.
 */

interface DataPoint {
  timestamp: string;
  count: number;
}

/**
 * Sample data representing event counts over time.
 * Used for testing and visualizing the scatter chart component before integrating real data.
 */
const dummyData: DataPoint[] = [
  { timestamp: '2024-10-29T09:00:00Z', count: 30 },
  { timestamp: '2024-10-29T09:10:00Z', count: 25 },
  { timestamp: '2024-10-29T09:20:00Z', count: 80 },
  { timestamp: '2024-10-29T09:30:00Z', count: 40 },
  { timestamp: '2024-10-29T09:40:00Z', count: 50 },
  { timestamp: '2024-10-29T09:50:00Z', count: 90 },
  { timestamp: '2024-10-29T10:00:00Z', count: 45 },
];

/**
 * Determines if a given count is considered an anomaly.
 * @param count - The event count at a specific timestamp.
 * @returns {boolean} - Returns `true` if the count exceeds the anomaly threshold (70), otherwise `false`.
 */

const isAnomaly = (count: number): boolean => count > 70;

/**
 * AnomalyChart Component
 * @returns {JSX.Element} - A scatter chart displaying event counts over time, with anomalies highlighted.
 *
 * This component renders a responsive scatter chart using the Recharts library.
 * It displays event counts on the Y-axis and timestamps on the X-axis.
 * Anomalies, determined by the `isAnomaly` function, are highlighted in red with a larger radius.
 */
const AnomalyChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          name="Time"
          tickFormatter={(time: string) => new Date(time).toLocaleTimeString()}
        />
        <YAxis dataKey="count" name="Event Count" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter
          name="Event Counts"
          data={dummyData}
          fill="#8884d8"
          shape="circle"
        >
          {dummyData.map((entry, index) => {
            const x = new Date(entry.timestamp).getTime();
            const y = entry.count;
            return (
              <circle
                key={`dot-${index}`}
                cx={x}
                cy={y}
                r={isAnomaly(entry.count) ? 8 : 4}
                fill={isAnomaly(entry.count) ? '#FF0000' : '#0088FE'}
              />
            );
          })}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default AnomalyChart;
