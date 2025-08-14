import React from 'react';

interface StatProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

const Stat: React.FC<StatProps> = ({ icon, label, value }) => {
    return (
        <div className="flex items-center gap-4 bg-dark-700/50 p-4 rounded-lg">
            <div className="flex-shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

export default Stat;
