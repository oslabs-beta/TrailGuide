import { useEffect, useState } from 'react';
import { getIpCounts } from '../../aws/sdkCalls.js';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { IpLocCount } from '../../types.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AccessByIpChart(): JSX.Element {
  const [data, setData] = useState<IpLocCount[]>([]);

  useEffect(() => {
    async function formatData(): Promise<void> {
      const newData = await getIpCounts();
      console.log(newData);
      setData(() => newData);
    }
    void formatData();
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
        data={data}
        label={renderCustomizedLabel}
        dataKey="count"
        labelLine={false}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend formatter={(_value, _entry, index) => data[index].ip} />

      {/**
       * Could use this to make the legend into a bunch of buttons that can change
       *  the state of a detailed location display, or another chart (access over time)
       * https://recharts.org/en-US/api/Legend#content
       */}
    </PieChart>
  );
}
