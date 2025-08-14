

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MatrixView from './components/MatrixView';
import MarketingGenius from './components/MarketingGenius';
import Leaderboard from './components/Leaderboard';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import TeamProgress from './components/TeamProgress';
import { ShieldCheck, LayoutGrid, BotMessageSquare, Trophy, HelpCircle, BookOpen, Wallet as WalletIcon, UserCircle, TrendingUp, X } from 'lucide-react';
import type { View, User } from './types';
import { MOCK_USER } from './constants';


const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [user, setUser] = useState<User>(MOCK_USER);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard user={user}/>;
            case 'matrix':
                return <MatrixView user={user} />;
            case 'team':
                return <TeamProgress user={user} />;
            case 'wallet':
                return <Wallet user={user} />;
            case 'marketing':
                return <MarketingGenius />;
            case 'leaderboard':
                return <Leaderboard />;
            case 'howitworks':
                return <HowItWorks />;
            case 'faq':
                return <FAQ />;
            case 'profile':
                return <Profile user={user} onUpdateUser={setUser} />;
            default:
                return <Dashboard user={user} />;
        }
    };

    const handleViewChange = (view: View) => {
        setActiveView(view);
        if (window.innerWidth < 1024) {
           setSidebarOpen(false);
        }
    }

    const navItems = [
        { id: 'dashboard', label: 'Панель управления', icon: LayoutGrid },
        { id: 'matrix', label: 'Матрица', icon: ShieldCheck },
        { id: 'team', label: 'Команда и Прогресс', icon: TrendingUp },
        { id: 'wallet', label: 'Кошелек', icon: WalletIcon },
        { id: 'profile', label: 'Профиль', icon: UserCircle },
        { id: 'marketing', label: 'AI-Копирайтер', icon: BotMessageSquare },
        { id: 'leaderboard', label: 'Лидеры', icon: Trophy },
        { id: 'howitworks', label: 'Как это работает', icon: BookOpen },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
    ];

    return (
        <div className="min-h-screen flex bg-dark-900 font-sans">
            {/* Overlay for mobile */}
            {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden" aria-hidden="true" />}

            <aside className={`
                fixed lg:relative inset-y-0 left-0 bg-dark-800 lg:w-64 p-4 lg:p-6 
                transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
                transition-transform duration-300 ease-in-out z-40 lg:z-auto 
                border-r border-dark-700 flex flex-col
                ${!isSidebarOpen ? 'pointer-events-none' : 'pointer-events-auto'} lg:pointer-events-auto
            `}>
                <div className="flex items-center justify-between gap-3 mb-8">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-10 w-10 text-brand-primary" />
                        <h1 className="text-xl font-bold text-white">MatrixFlow</h1>
                    </div>
                     <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex-1 flex flex-col space-y-2">
                    {navItems.map(item => (
                         <button
                            key={item.id}
                            onClick={() => handleViewChange(item.id as View)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full text-left
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
            </aside>
            <div className="flex-1 flex flex-col relative z-10 min-w-0">
                <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="mt-8 animate-fade-in">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;