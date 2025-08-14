import React from 'react';
import type { User } from '../types';
import { Bell, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
    user: User;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
    return (
        <header className="sticky top-0 z-20 flex justify-between items-center bg-dark-800/80 backdrop-blur-sm p-4 border-b border-dark-700 lg:mx-8 lg:mt-6 lg:rounded-xl lg:border">
            <div className="flex items-center gap-4">
                 <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-white">
                    <Menu className="h-6 w-6" />
                </button>
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">Добро пожаловать, {user.name.split(' ')[0]}!</h2>
                    <p className="hidden md:block text-sm text-gray-400">Вот ваша статистика на сегодня.</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </button>
                <div className="flex items-center gap-3 cursor-pointer group">
                    <img src={user.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full border-2 border-brand-secondary group-hover:border-brand-primary transition-colors" />
                    <div className="hidden sm:block">
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">Уровень {user.level}</p>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
            </div>
        </header>
    );
};

export default Header;