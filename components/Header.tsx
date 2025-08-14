import React, { useState, useEffect, useRef } from 'react';
import type { User, Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';
import NotificationsPanel from './NotificationsPanel';
import { Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
    user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const notificationsRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationsOpen]);
    
    const handleToggleNotifications = () => {
        setNotificationsOpen(prev => !prev);
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return (
        <header className="sticky top-0 z-20 flex justify-between items-center bg-dark-800/80 backdrop-blur-sm p-4 border-b border-dark-700 lg:mx-8 lg:mt-6 lg:rounded-xl lg:border">
            <div className="flex items-center gap-4">
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">Добро пожаловать, {user.name.split(' ')[0]}!</h2>
                    <p className="hidden md:block text-sm text-gray-400">Вот ваша статистика на сегодня.</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative" ref={notificationsRef}>
                    <button 
                        onClick={handleToggleNotifications} 
                        className="relative text-gray-400 hover:text-white transition-colors"
                        aria-haspopup="true"
                        aria-expanded={isNotificationsOpen}
                    >
                        <Bell className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <NotificationsPanel 
                            notifications={notifications} 
                            onClose={() => setNotificationsOpen(false)} 
                            onMarkAllRead={handleMarkAllRead} 
                        />
                    )}
                </div>

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