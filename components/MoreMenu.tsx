import React from 'react';
import type { View } from '../types';
import { X } from 'lucide-react';

interface MoreMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: { id: string; label: string; icon: React.ElementType }[];
    activeView: View;
    onViewChange: (view: View) => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ isOpen, onClose, navItems, activeView, onViewChange }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-center items-end animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-dark-800 w-full rounded-t-2xl border-t border-dark-700 p-4 animate-slide-in-up max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Дополнительно</h3>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-dark-700">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                         <button
                            key={item.id}
                            onClick={() => onViewChange(item.id as View)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-md font-medium transition-all duration-200 ease-in-out w-full text-left
                                ${activeView === item.id 
                                    ? 'bg-brand-primary text-white shadow-lg' 
                                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default MoreMenu;
