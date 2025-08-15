
import React from 'react';
import type { View } from '../types.ts';
import { X } from 'lucide-react';
import type { NavItem, NavGroup } from '../App.tsx';

interface MoreMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navConfig: (NavItem | NavGroup)[];
    activeView: View;
    onViewChange: (view: View) => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ isOpen, onClose, navConfig, activeView, onViewChange }) => {
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
                className="bg-dark-800 w-full rounded-t-2xl border-t border-dark-700 p-4 animate-slide-in-up max-w-lg max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white">Дополнительно</h3>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-dark-700">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                <nav className="flex flex-col space-y-1 overflow-y-auto">
                    {navConfig.map(el => {
                        if (el.type === 'item') {
                           return (
                                <button
                                    key={el.id}
                                    onClick={() => onViewChange(el.id)}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-md font-medium transition-all duration-200 ease-in-out w-full text-left
                                        ${activeView === el.id 
                                            ? 'bg-brand-primary text-white shadow-lg' 
                                            : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                                        }`}
                                >
                                    <el.icon className="h-5 w-5" />
                                    <span>{el.label}</span>
                                </button>
                           );
                        }
                        
                        return (
                             <div key={el.title} className="mt-2 first:mt-0">
                                <h4 className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                    <el.icon className="h-4 w-4"/>
                                    {el.title}
                                </h4>
                                {el.items.map(item => (
                                     <button
                                        key={item.id}
                                        onClick={() => onViewChange(item.id)}
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
                            </div>
                        )
                    })}
                </nav>
            </div>
        </div>
    );
};

export default MoreMenu;
