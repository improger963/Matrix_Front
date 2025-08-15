import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`
                bg-dark-800/70 backdrop-blur-sm border border-dark-700 rounded-xl shadow-lg p-4 sm:p-6 
                relative overflow-hidden
                transition-all duration-300 hover:shadow-brand-primary/20
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
