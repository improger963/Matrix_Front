
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface LineChartProps {
    data: { date: string; balance: number; }[];
    color: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-900/80 backdrop-blur-sm border border-dark-600 rounded-lg p-2 text-xs shadow-lg">
                <p className="font-bold text-white">{label}</p>
                <p style={{ color: payload[0].stroke }}>{`Баланс: $${payload[0].value.toFixed(2)} CAP`}</p>
            </div>
        );
    }
    return null;
};

const LineChart: React.FC<LineChartProps> = ({ data, color }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id={`color-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke={color} 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill={`url(#color-${color.replace('#', '')})`} 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default LineChart;
