import { useState, useEffect } from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import { CountedEvent, IPLocation } from '../../types';

// Define colors for the pie chart slices
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/**
 * Component to render a pie chart displaying access counts per IP location.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.currentIp] - The currently selected IP address.
 * @param {React.Dispatch<React.SetStateAction<string | undefined>>} props.setCurrentIp - Function to set the currently selected IP address.
 * @param {Array<IPLocation & CountedEvent>} props.ipLocCounts - Array of IP location counts.
 * @returns {JSX.Element} The rendered pie chart component.
 *
 * @component
 * @example
 * const currentIp = "192.168.1.1";
 * const setCurrentIp = (ip) => console.log(ip);
 * const ipLocCounts = [
 *   { source_ip: "192.168.1.1", count: 10, location: "Location A" },
 *   { source_ip: "192.168.1.2", count: 5, location: "Location B" }
 * ];
 * return (
 *   <AccessPerIpChart
 *     currentIp={currentIp}
 *     setCurrentIp={setCurrentIp}
 *     ipLocCounts={ipLocCounts}
 *   />
 * );
 */
export default function AccessPerIpChart({
  currentIp,
  setCurrentIp,
  ipLocCounts,
}: {
  currentIp?: string;
  setCurrentIp: React.Dispatch<React.SetStateAction<string | undefined>>;
  ipLocCounts: (IPLocation & CountedEvent)[];
}): JSX.Element {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for data
    setLoading(true);
    if (ipLocCounts && ipLocCounts.length > 0) {
      setLoading(false); // Once data is available, set loading to false
    }
  }, [ipLocCounts]);

  const RADIAN = Math.PI / 180;

  // Function to render custom labels inside the pie chart slices
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        className="pie-label"
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Show loading message while data is being fetched
  if (loading) return <p>Loading chart...</p>;

  return (
    <PieChart width={350} height={300}>
      <Pie
        data={ipLocCounts}
        label={renderCustomizedLabel}
        dataKey="count"
        labelLine={false}
      >
        {ipLocCounts.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend
        layout="vertical"
        align="right"
        verticalAlign="middle"
        formatter={(value: string) => {
          return value === currentIp ? (
            <strong style={{ textDecoration: 'underline' }}>{value}</strong>
          ) : (
            value
          );
        }}
        onClick={(payload) => {
          const payloadData = payload.payload as
            | (IPLocation & CountedEvent)
            | undefined;
          if (payloadData) {
            setCurrentIp((current: string | undefined) =>
              payloadData.source_ip === current
                ? undefined
                : payloadData.source_ip
            );
          }
        }}
      />
    </PieChart>
  );
}
