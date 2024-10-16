import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';

import { IpLocCount } from '../../types.js';

import { getIpCounts } from '../../aws/getIpCounts.ts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AccessPerIpChart({
  currentIp,
  setCurrentIp,
}: {
  currentIp?: string;
  setCurrentIp: React.Dispatch<React.SetStateAction<string | undefined>>;
}): JSX.Element {
  const [ipLocCounts, setIpLocCounts] = useState<IpLocCount[]>([]);

  useEffect(() => {
    async function updateIpLocCounts(): Promise<void> {
      const newData = await getIpCounts();
      setIpLocCounts(() => newData);
    }
    void updateIpLocCounts();
  }, []);

  const RADIAN = Math.PI / 180;
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

  return (
    <PieChart width={500} height={400}>
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
          return value === currentIp ? <strong>{value}</strong> : value;
        }}
        onClick={(payload) => {
          const payloadData = payload.payload as IpLocCount | undefined;
          if (payloadData) {
            setCurrentIp((current: string | undefined) =>
              payloadData.ip === current ? undefined : payloadData.ip
            );
          }
        }}
      />
    </PieChart>
  );
}
