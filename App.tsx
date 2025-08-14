



import React, { useState } from 'react';
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
import LiveFeedView from './components/LiveFeedView';
import { ShieldCheck, LayoutGrid, BotMessageSquare, Trophy, HelpCircle, BookOpen, Wallet as WalletIcon, UserCircle, TrendingUp, MoreHorizontal, Zap } from 'lucide-react';
import type { View, User } from './types';
import { MOCK_USER } from './constants';
import MoreMenu from './components/MoreMenu';


const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [user, setUser] = useState<User>(MOCK_USER);
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

    const handleLogout = () => {
        // In a real app, this would clear tokens, etc.
        console.log("User logged out");
        // For demonstration, we can just reset to the initial state or show a login screen
        // For now, we'll just log it.
    };

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
                return <Leaderboard user={user} />;
            case 'livefeed':
                return <LiveFeedView />;
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
        setMoreMenuOpen(false);
    }

    const navItems = [
        { id: 'dashboard', label: 'Панель управления', icon: LayoutGrid },
        { id: 'matrix', label: 'Матрица', icon: ShieldCheck },
        { id: 'team', label: 'Команда и Прогресс', icon: TrendingUp },
        { id: 'wallet', label: 'Кошелек', icon: WalletIcon },
        { id: 'profile', label: 'Профиль', icon: UserCircle },
        { id: 'marketing', label: 'AI-Копирайтер', icon: BotMessageSquare },
        { id: 'leaderboard', label: 'Лидеры', icon: Trophy },
        { id: 'livefeed', label: 'Живая лента', icon: Zap },
        { id: 'howitworks', label: 'Как это работает', icon: BookOpen },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
    ];
    
    const mainMobileNavItems = [
        { id: 'dashboard', label: 'Главная', icon: LayoutGrid },
        { id: 'matrix', label: 'Матрица', icon: ShieldCheck },
        { id: 'team', label: 'Команда', icon: TrendingUp },
        { id: 'wallet', label: 'Кошелек', icon: WalletIcon },
    ];

    const mainMobileNavIdsSet = new Set(mainMobileNavItems.map(item => item.id));
    const moreNavItems = navItems.filter(item => !mainMobileNavIdsSet.has(item.id));
    const isMoreMenuActive = moreNavItems.some(item => item.id === activeView);


    return (
        <div className="min-h-screen flex bg-dark-900 font-sans">
            <aside className="hidden lg:flex flex-col bg-dark-800/70 backdrop-blur-sm w-64 p-6 border-r border-dark-700">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="h-10 w-10 text-brand-primary" />
                    <h1 className="text-xl font-bold text-white">MatrixFlow</h1>
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
                <Header user={user} onViewChange={handleViewChange} onLogout={handleLogout} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
                    <div key={activeView} className="mt-8 animate-fade-in">
                        {renderView()}
                    </div>
                </main>
            </div>
            
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-800/80 backdrop-blur-sm border-t border-dark-700 z-50">
                <div className="flex justify-around items-center h-16">
                    {mainMobileNavItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleViewChange(item.id as View)}
                            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ease-in-out
                                ${activeView === item.id 
                                    ? 'text-brand-primary' 
                                    : 'text-gray-400 hover:text-brand-accent'
                                }`}
                        >
                            <item.icon className="h-6 w-6 mb-1" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => setMoreMenuOpen(true)}
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ease-in-out
                            ${isMoreMenuActive 
                                ? 'text-brand-primary' 
                                : 'text-gray-400 hover:text-brand-accent'
                            }`}
                    >
                        <MoreHorizontal className="h-6 w-6 mb-1" />
                        <span className="text-xs font-medium">Ещё</span>
                    </button>
                </div>
            </nav>

             <MoreMenu 
                isOpen={isMoreMenuOpen}
                onClose={() => setMoreMenuOpen(false)}
                navItems={moreNavItems}
                activeView={activeView}
                onViewChange={handleViewChange}
            />
        </div>
    );
};

export default App;