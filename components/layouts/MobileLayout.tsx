
import React, { useState, useMemo } from 'react';
import type { View } from '../../types.ts';
import type { NavItem, NavGroup } from '../../App.tsx';
import MoreMenu from '../MoreMenu.tsx';
import { LayoutDashboard, Users, Wallet, PieChart, MoreHorizontal, Briefcase } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext.tsx';
import { AnimatedBalance } from '../ui/Stat.tsx';

interface MobileLayoutProps {
    children: React.ReactNode;
    navConfig: (NavItem | NavGroup)[];
    activeView: View;
    onViewChange: (view: View) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, navConfig, activeView, onViewChange }) => {
    const { user } = useAppContext();
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

    const handleViewChange = (view: View) => {
        onViewChange(view);
        setMoreMenuOpen(false);
    }
    
    const mainMobileNavItems = [
        { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
        { id: 'market', label: 'Проекты', icon: PieChart },
        { id: 'network', label: 'Сеть', icon: Users },
        { id: 'assets', label: 'Активы', icon: Wallet },
    ];
    
    const mainMobileNavIdsSet = new Set(mainMobileNavItems.map(item => item.id));
    const isMoreMenuActive = navConfig.flatMap(el => el.type === 'item' ? [el] : el.items).some(item => !mainMobileNavIdsSet.has(item.id) && item.id === activeView);

    const moreNavConfig = useMemo(() => navConfig
      .map(el => {
        if (el.type === 'item') {
          return mainMobileNavIdsSet.has(el.id) ? null : el;
        }
        const filteredItems = el.items.filter(item => !mainMobileNavIdsSet.has(item.id));
        return filteredItems.length > 0 ? { ...el, items: filteredItems } : null;
      })
      .filter((el): el is NavItem | NavGroup => el !== null), [navConfig]);
      
    const isChatView = activeView === 'chat';
    const isProjectView = activeView === 'project';
    const hasPadding = !isChatView && !isProjectView;

    return (
         <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex justify-between items-center bg-dark-800/80 backdrop-blur-sm p-4 border-b border-dark-700">
                     <div className="flex items-center gap-2">
                        <Briefcase className="h-7 w-7 text-brand-primary" />
                        <h1 className="text-lg font-bold text-white">Nexus Capital</h1>
                    </div>
                    <div className="flex items-center gap-2">
                         <img src={user.avatarUrl} alt="User Avatar" onClick={() => handleViewChange('profile')} className="h-9 w-9 rounded-full border-2 border-brand-secondary" />
                    </div>
                </header>
                <main className={`flex-1 ${isChatView || isProjectView ? 'flex flex-col min-h-0' : 'overflow-y-auto'}`}>
                    <div key={activeView} className={`animate-fade-in w-full h-full ${
                        hasPadding ? 'p-4 pb-24' : ''
                    }`}>
                        {children}
                    </div>
                </main>
            
            <nav className="fixed bottom-0 left-0 right-0 bg-dark-800/80 backdrop-blur-sm border-t border-dark-700 z-50">
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
        </div>
    );
};

export default MobileLayout;
