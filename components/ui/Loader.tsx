
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full w-full absolute inset-0 bg-dark-900/50 backdrop-blur-sm z-50">
            <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute h-full w-full rounded-full border-2 border-brand-primary/50 animate-spin"></div>
                <div className="absolute h-20 w-20 rounded-full border-2 border-brand-accent/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                <div className="absolute h-16 w-16 rounded-full bg-brand-primary/20 animate-pulse"></div>
            </div>
        </div>
    );
};

export default Loader;
