import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`
            bg-dark-800 border border-dark-700 rounded-xl shadow-lg p-4 sm:p-6 
            relative overflow-hidden
            before:absolute before:inset-0 before:border-brand-primary/20 before:border before:rounded-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity
            transition-all duration-300 hover:shadow-brand-primary/20
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;