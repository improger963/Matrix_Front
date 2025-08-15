
import React, { useState, useEffect, useRef } from 'react';
import type { Notification } from '../types.ts';
import { MOCK_NOTIFICATIONS } from '../constants.ts';
import NotificationsPanel from './NotificationsPanel.tsx';
import { Bell, ChevronDown, LogOut, UserCircle, LifeBuoy, Wallet, Search, Briefcase } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { AnimatedBalance } from './ui/Stat.tsx';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const { user, setActiveView } = useAppContext();
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    
    const notificationsRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const useOutsideAlerter = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    callback();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [ref, callback]);
    }

    useOutsideAlerter(notificationsRef, () => setNotificationsOpen(false));
    useOutsideAlerter(userMenuRef, () => setUserMenuOpen(false));
    
    const handleToggleNotifications = () => {
        setNotificationsOpen(prev => !prev);
        setUserMenuOpen(false);
    };
    
    const handleToggleUserMenu = () => {
        setUserMenuOpen(prev => !prev);
        setNotificationsOpen(false);
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return (
        <header className="sticky top-0 z-20 flex justify-between items-center bg-dark-800/80 backdrop-blur-sm p-4 border-b border-dark-700 lg:mx-8 lg:mt-6 lg:rounded-xl lg:border">
            {/* Left side: Logo on mobile/tablet, Search on desktop */}
            <div className="flex items-center gap-2 lg:hidden">
                <Briefcase className="h-7 w-7 text-brand-primary" />
                <h1 className="text-lg font-bold text-white">Nexus Capital</h1>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-dark-900/70 border border-dark-700 rounded-lg px-3 py-1.5 w-full max-w-xs transition-all focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary">
                <Search className="h-5 w-5 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Поиск..."
                    className="bg-transparent w-full text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
                />
            </div>

            {/* Right side: Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
                <button 
                    onClick={() => setActiveView('capital')} 
                    className="hidden sm:flex items-center gap-2 bg-dark-700/50 hover:bg-dark-700 px-3 py-2 rounded-lg transition-colors"
                    title="Перейти в Капитал"
                >
                    <Wallet className="h-5 w-5 text-accent-green" />
                    <AnimatedBalance value={user.capital} isCurrency={true} className="text-white text-sm" />
                </button>
                <div className="relative" ref={notificationsRef}>
                    <button 
                        onClick={handleToggleNotifications} 
                        className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-dark-700"
                        aria-label="Открыть уведомления"
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

                <div className="relative" ref={userMenuRef}>
                    <button onClick={handleToggleUserMenu} type="button" className="flex items-center gap-2 group" aria-haspopup="true" aria-expanded={isUserMenuOpen}>
                        <img src={user.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full border-2 border-brand-secondary group-hover:border-brand-primary transition-colors" />
                        <div className="hidden sm:block text-left">
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-gray-400">Уровень {user.level}</p>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-gray-500 group-hover:text-white transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute top-full right-0 mt-4 w-64 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl animate-pop-in z-50">
                            <div className="p-4 border-b border-dark-700">
                                <p className="font-bold text-white truncate">{user.name}</p>
                                <p className="text-sm text-gray-400">ID: {user.id}</p>
                            </div>
                            <div className="p-2">
                                <button onClick={() => { setActiveView('profile'); setUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-dark-700 hover:text-white transition-colors">
                                    <UserCircle className="h-5 w-5" />
                                    <span>Мой профиль</span>
                                </button>
                                <button onClick={() => { setActiveView('support'); setUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-dark-700 hover:text-white transition-colors">
                                    <LifeBuoy className="h-5 w-5" />
                                    <span>Тех. Поддержка</span>
                                </button>
                                <div className="h-px bg-dark-700 my-1"></div>
                                <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                                    <LogOut className="h-5 w-5" />
                                    <span>Выйти</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;