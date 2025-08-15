import React, { useEffect, useState } from 'react';
import type { Toast as ToastType } from '../../types.ts';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
    toast: ToastType;
    onDismiss: (id: string) => void;
}

const icons = {
    success: <CheckCircle className="h-6 w-6 text-green-400" />,
    error: <XCircle className="h-6 w-6 text-red-400" />,
    info: <Info className="h-6 w-6 text-blue-400" />,
};

const borderColors = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500',
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    return (
        <div 
            className={`
                flex items-start w-full max-w-sm p-4 rounded-lg shadow-lg bg-dark-800 border-l-4
                ${borderColors[toast.type]}
                transition-all duration-300 transform
                ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
            `}
            role="alert"
        >
            <div className="flex-shrink-0">{icons[toast.type]}</div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">{toast.message}</p>
            </div>
            <button 
                onClick={handleDismiss} 
                className="ml-4 flex-shrink-0 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label="Close"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
};

export default Toast;