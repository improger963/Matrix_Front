
import React, { useState, useMemo } from 'react';
import Header from './components/Header.tsx';
import { LayoutDashboard, Briefcase, BotMessageSquare, Trophy, HelpCircle, BookOpen, Wallet, Users, Link, Megaphone, MessageSquare, Zap, ChevronDown, ListChecks, PieChart, GraduationCap, Newspaper, MoreHorizontal, Award } from 'lucide-react';
import type { View } from './types.ts';
import MoreMenu from './components/MoreMenu.tsx';
import { AppProvider, useAppContext } from './contexts/AppContext.tsx';
import AssistantWidget from './components/AssistantWidget.tsx';

// Statically import components
import DashboardView from './components/DashboardView.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import FAQ from './components/FAQ.tsx';
import CapitalView from './components/CapitalView.tsx';
import Profile from './components/Profile.tsx';
import SyndicateView from './components/SyndicateView.tsx';
import LiveFeedView from './components/LiveFeedView.tsx';
import Reviews from './components/Reviews.tsx';
import Support from './components/Support.tsx';
import News from './components/News.tsx';
import Academy from './components/Academy.tsx';
import Promo from './components/Promo.tsx';
import Chat from './components/Chat.tsx';
import LandingPage from './components/LandingPage.tsx';
import TasksView from './components/TasksView.tsx';
import StartupView from './components/StartupView.tsx';
import TheBoardroomView from './components/TheBoardroomView.tsx';


export type NavItem = {
  type: 'item';
  id: View;
  label: string;
  icon: React.ElementType;
};

export type NavGroup = {
  type: 'group';
  title: string;
  icon: React.ElementType;
  items: Omit<NavItem, 'type'>[];
};

const navConfig: (NavItem | NavGroup)[] = [
    { type: 'item', id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { type: 'item', id: 'market', label: 'Рынок Стартапов', icon: PieChart },
    { type: 'item', id: 'syndicate', label: 'Мой Синдикат', icon: Users },
    { type: 'item', id: 'tasks', label: 'Миссии', icon: ListChecks },
    { type: 'item', id: 'capital', label: 'Казначейство', icon: Wallet },
    { 
        type: 'group',
        title: 'Инструменты', 
        icon: Zap,
        items: [
            { id: 'promo', label: 'Промо-материалы', icon: Megaphone },
            { id: 'landingPage', label: 'Моя страница', icon: Link },
        ]
    },
    {
        type: 'group',
        title: 'Сообщество',
        icon: Users,
        items: [
            { id: 'chat', label: 'Общий чат', icon: MessageSquare },
            { id: 'leaderboard', label: 'Лидеры', icon: Trophy },
            { id: 'boardroom', label: 'Совет Директоров', icon: Award },
            { id: 'livefeed', label: 'Лента сделок', icon: Zap },
            { id: 'reviews', label: 'Отзывы', icon: MessageSquare },
        ]
    },
    {
        type: 'group',
        title: 'Информация',
        icon: BookOpen,
        items: [
            { id: 'academy', label: 'Nexus Institute', icon: GraduationCap },
            { id: 'news', label: 'Новости', icon: Newspaper },
            { id: 'howitworks', label: 'Как это работает', icon: HelpCircle },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
        ]
    }
];


const AppContent: React.FC = () => {
    const { activeView, subView, setActiveView } = useAppContext();
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

    const activeGroup = useMemo(() => 
        navConfig.find(el => el.type === 'group' && el.items.some(item => item.id === activeView)) as NavGroup | undefined
    , [activeView]);

    const [openGroups, setOpenGroups] = useState<string[]>(activeGroup ? [activeGroup.title] : []);

    const handleLogout = () => {
        console.log("User logged out");
    };
    
    const toggleGroup = (title: string) => {
        setOpenGroups(prev => 
            prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
        );
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView />;
            case 'market': return <DashboardView />; // Placeholder, can be a separate component
            case 'startup': return <StartupView />;
            case 'syndicate': return <SyndicateView initialTab={subView} />;
            case 'tasks': return <TasksView />;
            case 'capital': return <CapitalView />;
            case 'profile': return <Profile />;
            case 'landingPage': return <LandingPage />;
            case 'academy': return <Academy />;
            case 'promo': return <Promo />;
            case 'leaderboard': return <Leaderboard />;
            case 'boardroom': return <TheBoardroomView />;
            case 'livefeed': return <LiveFeedView />;
            case 'chat': return <Chat />;
            case 'reviews': return <Reviews />;
            case 'news': return <News />;
            case 'howitworks': return <HowItWorks />;
            case 'faq': return <FAQ />;
            case 'support': return <Support />;
            default: return <DashboardView />;
        }
    };

    const handleViewChange = (view: View) => {
        setActiveView(view);
        setMoreMenuOpen(false);
    }
    
    const mainMobileNavItems = [
        { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
        { id: 'market', label: 'Рынок', icon: PieChart },
        { id: 'syndicate', label: 'Синдикат', icon: Users },
        { id: 'capital', label: 'Капитал', icon: Wallet },
    ];
    
    const allNavItemsForMoreMenu = navConfig.flatMap(el => el.type === 'item' ? [el] : el.items);
    const mainMobileNavIdsSet = new Set(mainMobileNavItems.map(item => item.id));
    const isMoreMenuActive = allNavItemsForMoreMenu.some(item => !mainMobileNavIdsSet.has(item.id) && item.id === activeView);

    const moreNavConfig = useMemo(() => navConfig
      .map(el => {
        if (el.type === 'item') {
          return mainMobileNavIdsSet.has(el.id) ? null : el;
        }
        const filteredItems = el.items.filter(item => !mainMobileNavIdsSet.has(item.id));
        return filteredItems.length > 0 ? { ...el, items: filteredItems } : null;
      })
      .filter((el): el is NavItem | NavGroup => el !== null), []);
      
    const isChatView = activeView === 'chat';

    return (
        <div className="min-h-screen flex bg-dark-900 font-sans">
            <aside className="hidden lg:flex flex-col bg-dark-800/70 backdrop-blur-sm w-64 p-4 border-r border-dark-700">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <Briefcase className="h-10 w-10 text-brand-primary" />
                    <h1 className="text-xl font-bold text-white">Nexus Capital</h1>
                </div>
                <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto">
                    {navConfig.map((el) => {
                        if (el.type === 'item') {
                            return (
                                <button
                                    key={el.id}
                                    onClick={() => handleViewChange(el.id as View)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full text-left
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
                        const isGroupOpen = openGroups.includes(el.title);
                        const isGroupActive = el.items.some(item => item.id === activeView);
                        return (
                             <div key={el.title}>
                                <button
                                    onClick={() => toggleGroup(el.title)}
                                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full text-left
                                        ${isGroupActive ? 'text-white' : 'text-gray-300 hover:bg-dark-700 hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <el.icon className={`h-5 w-5 ${isGroupActive ? 'text-brand-accent' : ''}`} />
                                        <span>{el.title}</span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-300 ease-in-out ${isGroupOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="pt-1 pl-4 border-l-2 border-dark-700 ml-5 space-y-1 mt-1">
                                            {el.items.map(item => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleViewChange(item.id as View)}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ease-in-out w-full text-left
                                                        ${activeView === item.id 
                                                            ? 'bg-dark-700 text-brand-primary' 
                                                            : 'text-gray-400 hover:bg-dark-700/50 hover:text-gray-200'
                                                        }`}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden">
                <Header onLogout={handleLogout} />
                <main className={`flex-1 ${isChatView ? 'flex flex-col min-h-0' : 'overflow-y-auto'}`}>
                    <div key={activeView} className={`animate-fade-in w-full h-full ${
                        isChatView
                            ? 'flex flex-col p-4 sm:p-6 lg:p-8'
                            : 'p-4 sm:p-6 lg:p-8 mt-8 pb-24 lg:pb-8'
                    }`}>
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
                navConfig={moreNavConfig}
                activeView={activeView}
                onViewChange={handleViewChange}
            />
            <AssistantWidget />
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;