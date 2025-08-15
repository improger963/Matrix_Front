
import React, { useState, useEffect, useRef } from 'react';

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


interface AnimatedBalanceProps {
    value: number;
    className?: string;
}

export const AnimatedBalance: React.FC<AnimatedBalanceProps> = ({ value, className = '' }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValueRef = useRef(value);
    const frameRef = useRef<number | null>(null);
    const duration = 1500; // Animation duration in ms

    useEffect(() => {
        const startValue = prevValueRef.current;
        const endValue = value;
        let startTime: number | null = null;
        
        if (startValue === endValue) {
            setDisplayValue(endValue);
            return;
        }

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Ease-out quad function for smooth deceleration
            const easedPercentage = percentage * (2 - percentage);
            
            const currentValue = startValue + (endValue - startValue) * easedPercentage;
            setDisplayValue(currentValue);

            if (progress < duration) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
                prevValueRef.current = endValue;
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
            prevValueRef.current = endValue;
        };
    }, [value]);

    return (
        <span className={`font-mono font-bold tracking-tighter ${className}`}>
            ${displayValue.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}
        </span>
    );
};

export default Stat;
