
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, BotMessageSquare, Award, HelpCircle, BookOpen, Wallet, Users, Link, Megaphone, MessageSquare, Zap, ChevronDown, ListChecks, PieChart, GraduationCap, Newspaper, MoreHorizontal, Trophy, Shield } from 'lucide-react';
import type { View } from './types.ts';
import { AppProvider, useAppContext } from './contexts/AppContext.tsx';
import AssistantWidget from './components/AssistantWidget.tsx';
import DesktopLayout from './components/layouts/DesktopLayout.tsx';
import MobileLayout from './components/layouts/MobileLayout.tsx';

// Statically import components
import DashboardView from './components/DashboardView.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import FAQ from './components/FAQ.tsx';
import AssetManagementView from './components/AssetManagementView.tsx';
import Profile from './components/Profile.tsx';
import NetworkView from './components/NetworkView.tsx';
import LiveFeedView from './components/LiveFeedView.tsx';
import Reviews from './components/Reviews.tsx';
import Support from './components/Support.tsx';
import News from './components/News.tsx';
import { Academy } from './components/Academy.tsx';
import Promo from './components/Promo.tsx';
import Chat from './components/Chat.tsx';
import LandingPage from './components/LandingPage.tsx';
import TasksView from './components/TasksView.tsx';
import ProjectView from './components/ProjectView.tsx';
import TheBoardroomView from './components/TheBoardroomView.tsx';
import NetworkAchievementsView from './components/NetworkAchievementsView.tsx';


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
    { type: 'item', id: 'project', label: 'Мой Проект', icon: Briefcase },
    { type: 'item', id: 'network', label: 'Бизнес-сеть', icon: Users },
    { type: 'item', id: 'tasks', label: 'Центр Миссий', icon: ListChecks },
    { type: 'item', id: 'assets', label: 'Активы', icon: Wallet },
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
            { id: 'achievements', label: 'Зал Славы', icon: Shield },
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

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);
    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
};

const AppContent: React.FC = () => {
    const { activeView, setActiveView, RankUpModal } = useAppContext();
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView />;
            case 'project': return <ProjectView />;
            case 'network': return <NetworkView />;
            case 'tasks': return <TasksView />;
            case 'assets': return <AssetManagementView />;
            case 'profile': return <Profile />;
            case 'landingPage': return <LandingPage />;
            case 'academy': return <Academy />;
            case 'promo': return <Promo />;
            case 'leaderboard': return <Leaderboard />;
            case 'boardroom': return <TheBoardroomView />;
            case 'achievements': return <NetworkAchievementsView achievementStats={{unlockedCount: 0, totalCount: 0, progress: 0}} isHallOfFame={true}/>;
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
    
    const LayoutComponent = isDesktop ? DesktopLayout : MobileLayout;

    return (
        <div className="min-h-screen bg-dark-900 font-sans text-gray-200">
           <LayoutComponent
              navConfig={navConfig}
              activeView={activeView}
              onViewChange={(view) => setActiveView(view)}
           >
              {renderView()}
           </LayoutComponent>
           <AssistantWidget />
           {RankUpModal && <RankUpModal />}
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
