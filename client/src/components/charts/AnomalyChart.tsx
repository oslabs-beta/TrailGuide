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

interface DataPoint {
  timestamp: string;
  count: number;
}

const dummyData: DataPoint[] = [
  { timestamp: '2024-10-29T09:00:00Z', count: 30 },
  { timestamp: '2024-10-29T09:10:00Z', count: 25 },
  { timestamp: '2024-10-29T09:20:00Z', count: 80 },
  { timestamp: '2024-10-29T09:30:00Z', count: 40 },
  { timestamp: '2024-10-29T09:40:00Z', count: 50 },
  { timestamp: '2024-10-29T09:50:00Z', count: 90 },
  { timestamp: '2024-10-29T10:00:00Z', count: 45 },
];

const isAnomaly = (count: number): boolean => count > 70; // Define a threshold for anomalies

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
