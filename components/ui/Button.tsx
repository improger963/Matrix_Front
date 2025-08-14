import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'px-6 py-2.5 font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5';
    
    const variantClasses = {
        primary: 'bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary hover:shadow-lg hover:shadow-brand-primary/40',
        secondary: 'bg-dark-700 text-gray-200 hover:bg-dark-600 focus:ring-brand-accent hover:shadow-lg hover:shadow-gray-900/40'
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;