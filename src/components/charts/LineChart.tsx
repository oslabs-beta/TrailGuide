import React, { useState, useEffect } from 'react';
import { CartesianGrid, XAxis, YAxis, AreaChart, Area, Legend, Tooltip  } from 'recharts';

interface UserActivityData {
    timestamp: string; // can change to date? depending on the data
    activityCount: number;
}

//TODO: implement auto-update with current data
const initialData: UserActivityData[] = [
    { timestamp: '2024-10-01', activityCount: 30 },
    { timestamp: '2024-10-02', activityCount: 50 },
    { timestamp: '2024-10-03', activityCount: 20 },
    { timestamp: '2024-10-04', activityCount: 100 }, 
    { timestamp: '2024-10-05', activityCount: 60 },
    { timestamp: '2024-10-06', activityCount: 70 },
    { timestamp: '2024-10-07', activityCount: 90 },
];

const UserActivityChart: React.FC = () => {
    const [data, setData] = useState<UserActivityData[]>(initialData);

    //effect for simulating updates
    useEffect(() => {
        setTimeout(() => {
            setData(prevData => [
                ...prevData,
                { timestamp: `2024-10-${prevData.length + 8}`, activityCount: Math.floor(Math.random() * 150) }
            ]);
        }, 5000);
    }, []);

    return (
        <AreaChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="activityCount" stroke="#8884d8" fill="#82ca9d" activeDot={{ r: 8 }} />
        </AreaChart>
      );
    };
    
    export default UserActivityChart;
