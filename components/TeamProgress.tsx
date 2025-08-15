
import React, { useState, useMemo } from 'react';
import Card from './ui/Card.tsx';
import type { TeamMember, Achievement } from '../types.ts';
import { MOCK_TEAM_MEMBERS, MOCK_ACHIEVEMENTS } from '../constants.ts';
import { Users, UserPlus, Activity, ChevronUp, ChevronDown, Zap, BarChart3, Flame, Rocket, Award, GraduationCap } from 'lucide-react';

type SortKey = 'name' | 'joinDate' | 'level' | 'referrals';
type SortOrder = 'asc' | 'desc';
type Tab = 'analytics' | 'team' | 'achievements';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const { unlocked, icon: Icon, title, description, progress } = achievement;
    const progressPercentage = progress ? (progress.current / progress.target) * 100 : 0;
    
    return (
        <Card className={`!p-4 flex flex-col justify-between gap-4 transition-all duration-300 h-full ${unlocked ? 'bg-dark-700' : 'bg-dark-800/50 opacity-70'}`}>
            <div>
                <div className="flex items-start justify-between">
                    <div className={`relative flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${unlocked ? 'bg-brand-primary/20' : 'bg-dark-700'}`}>
                        <Icon className={`h-8 w-8 ${unlocked ? 'text-brand-primary' : 'text-gray-500'}`} />
                    </div>
                </div>
                <h4 className={`font-bold mt-4 ${unlocked ? 'text-white' : 'text-gray-400'}`}>{title}</h4>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
            {progress && (
                <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Прогресс</span>
                        <span>{Math.min(progress.current, progress.target)}/{progress.target}</span>
                    </div>
                    <div className="w-full bg-dark-900 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${unlocked ? 'bg-green-500' : 'bg-brand-secondary'}`} style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                    </div>
                </div>
            )}
        </Card>
    );
};

const AnalyticsStatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; note: string; }> = ({ icon, label, value, note }) => (
    <Card className="!bg-dark-800/50 h-full">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-dark-900 rounded-lg">{icon}</div>
            <p className="font-semibold text-gray-300">{label}</p>
        </div>
        <p className="text-4xl font-bold text-white my-3">{value}</p>
        <p className="text-xs text-gray-500">{note}</p>
    </Card>
);

const GaugeChart: React.FC<{ score: number }> = ({ score }) => {
    const semiCircumference = 125.6;
    const offset = semiCircumference * (1 - score / 100);
    const scoreColor = score > 75 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400';
    const scoreStroke = score > 75 ? 'stroke-green-400' : score > 40 ? 'stroke-yellow-400' : 'stroke-red-400';

    return (
        <div className="relative w-48 h-24 mx-auto">
            <svg width="192" height="96" viewBox="0 0 100 50" className="w-full h-full rotate-180">
                <path d="M 10,50 A 40,40 0 1,1 90,50" stroke="#334155" strokeWidth="10" fill="none" strokeLinecap="round" />
                <path
                    d="M 10,50 A 40,40 0 1,1 90,50"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    className={`animate-gauge-fill ${scoreStroke}`}
                    style={{ strokeDasharray: semiCircumference, strokeDashoffset: offset }}
                />
            </svg>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-4xl font-bold ${scoreColor}`}>
                {score}
            </div>
        </div>
    );
};

const DonutChart: React.FC<{ active: number; inactive: number }> = ({ active, inactive }) => {
    const total = active + inactive;
    const activePercent = total > 0 ? (active / total) * 100 : 0;
    const circumference = 282.7;
    const activeOffset = circumference * (1 - activePercent / 100);

    return (
         <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#334155" strokeWidth="10" />
                <circle
                    cx="50" cy="50" r="45"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="text-green-400 animate-donut-fill"
                    style={{ strokeDasharray: circumference, strokeDashoffset: activeOffset }}
                />
            </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-3xl font-bold text-white">{activePercent.toFixed(0)}%</span>
                 <span className="text-xs text-gray-400">Активных</span>
            </div>
        </div>
    );
};

const TeamProgress: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('analytics');
    const [sortKey, setSortKey] = useState<SortKey>('joinDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const sortedTeamMembers = useMemo(() => {
        return [...MOCK_TEAM_MEMBERS].sort((a, b) => {
            let comparison = 0;
            if (sortKey === 'name') comparison = a.name.localeCompare(b.name);
            else if (sortKey === 'joinDate') comparison = new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
            else comparison = (b[sortKey] as number) - (a[sortKey] as number);
            return sortOrder === 'asc' ? -comparison : comparison;
        });
    }, [sortKey, sortOrder]);
    
    const teamAnalytics = useMemo(() => {
        const team = MOCK_TEAM_MEMBERS;
        const totalMembers = team.length;
        const activeCount = team.filter(m => m.status === 'active').length;
        const activityRate = totalMembers > 0 ? (activeCount / totalMembers) * 100 : 0;
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newLast7Days = team.filter(m => new Date(m.joinDate) >= sevenDaysAgo).length;

        const totalLevel = team.reduce((sum, m) => sum + m.level, 0);
        const averageLevel = totalMembers > 0 ? (totalLevel / totalMembers) : 0;
        
        const performanceScore = Math.round((activityRate * 0.7) + (Math.min(averageLevel, 10) / 10 * 0.3) * 100);
        const topReferrers = [...team].sort((a, b) => b.referrals - a.referrals).slice(0, 3);
        
        const insights = [];
        if (activityRate < 60) insights.push({ icon: Flame, text: `Низкая активность (${activityRate.toFixed(0)}%). Проведите мотивационный вебинар.`, type: 'warning' });
        if (newLast7Days >= 5) insights.push({ icon: Rocket, text: `Отличный темп роста! ${newLast7Days} новых партнера за неделю.`, type: 'success' });
        if (topReferrers.length > 0 && topReferrers[0].referrals > 3) insights.push({ icon: Award, text: `${topReferrers[0].name} — ваш лучший рекрутер. Отметьте его успехи!`, type: 'info' });
        if (averageLevel < 2 && insights.length < 2) insights.push({ icon: GraduationCap, text: `Средний уровень команды невысок. Сконцентрируйтесь на обучении.`, type: 'info' });
        if (insights.length === 0) insights.push({ icon: Award, text: `Отличные показатели! Команда работает эффективно.`, type: 'success' });

        return {
            activeCount,
            inactiveCount: totalMembers - activeCount,
            activityRate,
            newLast7Days,
            averageLevel,
            performanceScore,
            topReferrers,
            insights: insights.slice(0, 2)
        };
    }, []);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortOrder('desc'); }
    };

    const SortableHeader: React.FC<{ sortKeyName: SortKey, children: React.ReactNode, className?: string }> = ({ sortKeyName, children, className }) => (
        <th className={`p-4 text-sm font-semibold text-gray-400 cursor-pointer ${className}`} onClick={() => handleSort(sortKeyName)}>
            <div className="flex items-center gap-1">
                {children}
                {sortKey === sortKeyName && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
            </div>
        </th>
    );

    const renderTeamView = () => (
        <Card>
            <h3 className="text-xl font-bold text-white mb-4">Мои личные партнеры</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-dark-700">
                        <tr>
                            <SortableHeader sortKeyName="name">Партнер</SortableHeader>
                            <SortableHeader sortKeyName="joinDate">Дата вступления</SortableHeader>
                            <SortableHeader sortKeyName="level" className="text-center">Уровень</SortableHeader>
                            <SortableHeader sortKeyName="referrals" className="text-center">Их рефералы</SortableHeader>
                            <th className="p-4 text-sm font-semibold text-gray-400">Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTeamMembers.map(member => (
                            <tr key={member.id} className="border-b border-dark-700 last:border-b-0 hover:bg-dark-700/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                                        <span className="font-medium text-white">{member.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-400">{new Date(member.joinDate).toLocaleDateString('ru-RU')}</td>
                                <td className="p-4 font-medium text-white text-center">{member.level}</td>
                                <td className="p-4 font-medium text-white text-center">{member.referrals}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {member.status === 'active' ? 'Активен' : 'Неактивен'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
    
    const renderAchievementsView = () => (
        <Card>
             <h3 className="text-xl font-bold text-white mb-4">Достижения команды и личные</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_ACHIEVEMENTS.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
            </div>
        </Card>
    );

    const renderAnalyticsView = () => {
        const { performanceScore, activityRate, newLast7Days, averageLevel, activeCount, inactiveCount, topReferrers, insights } = teamAnalytics;
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center p-6 animate-slide-in-up">
                        <h3 className="text-lg font-bold text-white mb-4">Эффективность команды</h3>
                        <GaugeChart score={performanceScore} />
                        <p className="text-sm text-gray-400 mt-4">Оценка на основе активности и среднего уровня партнеров.</p>
                    </Card>

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                            <AnalyticsStatCard icon={<Activity className="w-6 h-6 text-green-400" />} label="Активность команды" value={`${activityRate.toFixed(0)}%`} note={`${activeCount} из ${activeCount + inactiveCount} партнеров`} />
                        </div>
                        <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                            <AnalyticsStatCard icon={<UserPlus className="w-6 h-6 text-cyan-400" />} label="Рост за 7 дней" value={`+${newLast7Days}`} note="Новых партнеров" />
                        </div>
                        <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
                            <AnalyticsStatCard icon={<BarChart3 className="w-6 h-6 text-purple-400" />} label="Средний уровень" value={`${averageLevel.toFixed(1)}`} note="Общий опыт команды" />
                        </div>
                        <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                            <Card className="!bg-dark-800/50 flex flex-col justify-center items-center">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Состав команды</h4>
                                <DonutChart active={activeCount} inactive={inactiveCount} />
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="animate-slide-in-up" style={{ animationDelay: '500ms' }}>
                         <h3 className="text-xl font-bold text-white mb-4">🏆 Топ рекрутеры</h3>
                         <div className="space-y-3">
                            {topReferrers.map((member, index) => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                                    <div className="flex items-center gap-3"><span className="font-bold text-lg w-5">{index + 1}.</span><img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                                        <div><p className="font-semibold text-white">{member.name}</p><p className="text-xs text-gray-400">Уровень {member.level}</p></div>
                                    </div>
                                    <div className="text-right"><p className="font-bold text-brand-accent text-lg">{member.referrals}</p><p className="text-xs text-gray-500">рефералов</p></div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className="animate-slide-in-up" style={{ animationDelay: '600ms' }}>
                        <h3 className="text-xl font-bold text-white mb-4">💡 Умные советы</h3>
                        <div className="space-y-4">
                            {insights.map((insight, index) => {
                                const typeClasses = { warning: 'bg-red-500/10 text-red-400 border-red-500/50', success: 'bg-green-500/10 text-green-400 border-green-500/50', info: 'bg-blue-500/10 text-blue-400 border-blue-500/50' };
                                return (
                                    <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${typeClasses[insight.type as keyof typeof typeClasses]}`}>
                                        <insight.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm">{insight.text}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-dark-700">
                <nav className="-mb-px flex gap-2 sm:gap-4 overflow-x-auto">
                    <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 whitespace-nowrap ${activeTab === 'analytics' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}><BarChart3 className="h-5 w-5"/>Аналитика</button>
                    <button onClick={() => setActiveTab('team')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 whitespace-nowrap ${activeTab === 'team' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}><Users className="h-5 w-5"/>Список команды</button>
                    <button onClick={() => setActiveTab('achievements')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 whitespace-nowrap ${activeTab === 'achievements' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}><Zap className="h-5 w-5"/>Достижения</button>
                </nav>
            </div>
            
            <div className="animate-fade-in">
                {activeTab === 'team' ? renderTeamView() : activeTab === 'achievements' ? renderAchievementsView() : renderAnalyticsView()}
            </div>
        </div>
    );
};

export default TeamProgress;
