
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DonutChartProps {
    data: { name: string; value: number; color: string; }[];
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-900/80 backdrop-blur-sm border border-dark-600 rounded-lg p-2 text-xs shadow-lg">
                <p className="font-bold text-white">{`${payload[0].name}`}</p>
                <p style={{ color: payload[0].payload.color }}>{`$${Math.abs(payload[0].value).toFixed(2)} CAP`}</p>
            </div>
        );
    }
    return null;
};

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DonutChart;
