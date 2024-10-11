import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

const initialData: DataPoint[] = [
  { name: 'Sadness', value: 400 },
  { name: 'Anger', value: 300 },
  { name: 'Frustration', value: 300 },
  { name: 'Depression', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TestPieChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>(initialData);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData(prevData =>
        prevData.map(point => ({
          ...point,
          value: Math.floor(Math.random() * 500),
        }))
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name }) => name} // Using name directly
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default TestPieChart;

