
import React, { useState, useMemo } from 'react';
import { Briefcase, ChevronDown, UserCircle, LifeBuoy, LogOut, Wallet, Award, Zap } from 'lucide-react';
import type { View, NavItem, NavGroup } from '../../types.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import { AnimatedBalance } from '../ui/Stat.tsx';
import { RANK_THRESHOLDS } from '../../constants.ts';

const RankWidget: React.FC = () => {
    const { user } = useAppContext();
    const currentRankThreshold = RANK_THRESHOLDS[user.rank];
    const nextRank = Object.keys(RANK_THRESHOLDS).find(rank => RANK_THRESHOLDS[rank as keyof typeof RANK_THRESHOLDS] > currentRankThreshold);
    const nextRankThreshold = nextRank ? RANK_THRESHOLDS[nextRank as keyof typeof RANK_THRESHOLDS] : user.reputation;
    const reputationProgress = nextRank ? ((user.reputation - currentRankThreshold) / (nextRankThreshold - currentRankThreshold)) * 100 : 100;
    
    return (
        <div className="bg-dark-900/50 p-2 rounded-lg">
            <div className="flex justify-between items-center text-xs mb-1">
                <p className="font-bold text-brand-accent">{user.rank}</p>
                <p className="text-gray-400">{user.reputation} / {nextRankThreshold} RP</p>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-1">
                <div className="bg-brand-primary h-1 rounded-full" style={{ width: `${reputationProgress}%` }}></div>
            </div>
        </div>
    )
}


interface DesktopLayoutProps {
    children: React.ReactNode;
    navConfig: (NavItem | NavGroup)[];
    activeView: View;
    onViewChange: (view: View) => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children, navConfig, activeView, onViewChange }) => {
    const { user, setActiveView } = useAppContext();
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = React.useRef<HTMLDivElement>(null);

     React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeGroup = useMemo(() => 
        navConfig.find(el => el.type === 'group' && el.items.some(item => item.id === activeView)) as NavGroup | undefined
    , [activeView, navConfig]);
    
    const [openGroups, setOpenGroups] = useState<string[]>(activeGroup ? [activeGroup.title] : []);
    
    const toggleGroup = (title: string) => {
        setOpenGroups(prev => 
            prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
        );
    };

    return (
        <div className="min-h-screen flex bg-dark-900 font-sans">
            <aside className="flex flex-col bg-dark-800/70 backdrop-blur-sm w-64 p-4 border-r border-dark-700">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <Briefcase className="h-10 w-10 text-brand-primary" />
                    <h1 className="text-xl font-bold text-white">Nexus Capital</h1>
                </div>
                <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto pr-2">
                    {navConfig.map((el) => {
                        if (el.type === 'item') {
                            return (
                                <button
                                    key={el.id}
                                    onClick={() => onViewChange(el.id)}
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
                                                    onClick={() => onViewChange(item.id)}
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
                 <div className="mt-auto pt-4 border-t border-dark-700" ref={userMenuRef}>
                    <div className="relative">
                        {isUserMenuOpen && (
                            <div className="absolute bottom-full left-0 mb-3 w-full bg-dark-800 border border-dark-700 rounded-xl shadow-2xl animate-pop-in z-50">
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
                                    <button onClick={() => {}} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                                        <LogOut className="h-5 w-5" />
                                        <span>Выйти</span>
                                    </button>
                                </div>
                            </div>
                        )}
                         <button onClick={() => setUserMenuOpen(p => !p)} type="button" className="flex items-center gap-2 group w-full p-2 rounded-lg hover:bg-dark-700 transition-colors">
                            <img src={user.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full border-2 border-dark-600 group-hover:border-brand-primary transition-colors" />
                            <div className="text-left flex-1">
                                <p className="font-semibold text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-400">Уровень {user.level}</p>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-gray-500 group-hover:text-white transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden">
                 <header className="sticky top-0 z-20 flex justify-between items-center bg-dark-800/80 backdrop-blur-sm p-4 border-b border-dark-700 mx-8 mt-6 rounded-xl border">
                    <RankWidget />
                    <button 
                        onClick={() => setActiveView('assets')} 
                        className="flex items-center gap-2 bg-dark-700/50 hover:bg-dark-700 px-3 py-2 rounded-lg transition-colors"
                        title="Перейти к Управлению Активами"
                    >
                        <Wallet className="h-5 w-5 text-accent-green" />
                        <AnimatedBalance value={user.capital} isCurrency={true} className="text-white text-sm" />
                    </button>
                 </header>
                <main className="flex-1 overflow-y-auto">
                    <div key={activeView} className={`animate-fade-in w-full h-full p-4 sm:p-6 lg:p-8 ${activeView === 'chat' || activeView === 'project' ? 'flex flex-col' : ''}`}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DesktopLayout;