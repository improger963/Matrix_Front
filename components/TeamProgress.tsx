import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import type { User, TeamMember, Achievement } from '../types';
import { MOCK_TEAM_MEMBERS, MOCK_ACHIEVEMENTS } from '../constants';
import { Users, UserPlus, Activity, ChevronUp, ChevronDown, Trophy, Zap, Share2 } from 'lucide-react';

type SortKey = 'name' | 'joinDate' | 'level' | 'referrals';
type SortOrder = 'asc' | 'desc';

const TeamStat: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="bg-dark-800/50 p-4 rounded-lg flex items-center gap-4">
        <div className="text-brand-accent p-3 bg-dark-900 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const { unlocked, icon: Icon, title, description, progress } = achievement;
    const progressPercentage = progress ? (progress.current / progress.target) * 100 : 0;
    
    return (
        <Card className={`
            !p-4 flex flex-col justify-between gap-4 transition-all duration-300 h-full
            ${unlocked ? 'bg-dark-700 relative animate-glow' : 'bg-dark-800/50 opacity-70'}
        `}>
            <div>
                <div className="flex items-start justify-between">
                    <div className={`
                        relative flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center
                        ${unlocked ? 'bg-brand-primary/20' : 'bg-dark-700'}
                    `}>
                        <Icon className={`h-8 w-8 ${unlocked ? 'text-brand-primary' : 'text-gray-500'}`} />
                    </div>
                    {unlocked && (
                         <button className="flex items-center gap-1.5 text-xs bg-dark-600/50 hover:bg-dark-600 px-2 py-1 rounded-md text-brand-accent">
                            <Share2 className="h-3 w-3" />
                            <span>Поделиться</span>
                        </button>
                    )}
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
    )
};

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
    <div className="p-4 rounded-lg bg-dark-700/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                <span className="font-bold text-white">{member.name}</span>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {member.status === 'active' ? 'Активен' : 'Неактивен'}
            </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm border-t border-dark-600 pt-3">
            <div>
                <p className="text-gray-400 text-xs">Уровень</p>
                <p className="font-semibold text-white">{member.level}</p>
            </div>
            <div>
                <p className="text-gray-400 text-xs">Рефералы</p>
                <p className="font-semibold text-white">{member.referrals}</p>
            </div>
             <div>
                <p className="text-gray-400 text-xs">Вступил</p>
                <p className="font-semibold text-white">{new Date(member.joinDate).toLocaleDateString('ru-RU')}</p>
            </div>
        </div>
    </div>
);


const TeamProgress: React.FC<{ user: User }> = () => {
    const [activeTab, setActiveTab] = useState<'team' | 'achievements'>('team');
    const [sortKey, setSortKey] = useState<SortKey>('joinDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const sortedTeamMembers = useMemo(() => {
        const sorted = [...MOCK_TEAM_MEMBERS];
        sorted.sort((a, b) => {
            let comparison = 0;
            switch (sortKey) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'joinDate': {
                    const dateA = new Date(a.joinDate);
                    const dateB = new Date(b.joinDate);
                    comparison = dateA.getTime() - dateB.getTime();
                    break;
                }
                case 'level':
                    comparison = a.level - b.level;
                    break;
                case 'referrals':
                    comparison = a.referrals - b.referrals;
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return sorted;
    }, [sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
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
        <>
            <Card className="mb-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TeamStat icon={<Users className="h-6 w-6"/>} label="Всего в команде" value={MOCK_TEAM_MEMBERS.length + 1} />
                    <TeamStat icon={<Activity className="h-6 w-6"/>} label="Активных партнеров" value={MOCK_TEAM_MEMBERS.filter(m => m.status === 'active').length} />
                    <TeamStat icon={<UserPlus className="h-6 w-6"/>} label="Новых сегодня" value={3} />
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold text-white mb-2">Рост команды (последние 7 дней)</h4>
                    <div className="flex items-end justify-between h-32 bg-dark-800/50 p-4 rounded-lg gap-2">
                        {[2,3,1,5,4,7,3].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end">
                                <div 
                                    className="w-full bg-brand-secondary rounded-t-md hover:bg-brand-primary transition-colors"
                                    style={{ height: `${(val / 7) * 100}%` }}
                                    title={`${val} новых`}
                                ></div>
                                <span className="text-xs text-gray-500 mt-1">{i+1}д</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold text-white mb-4">Мои личные партнеры</h3>
                
                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                    {sortedTeamMembers.map(member => <TeamMemberCard key={member.id} member={member} />)}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
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
                            {sortedTeamMembers.map((member) => (
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
        </>
    );
    
    const renderAchievementsView = () => (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_ACHIEVEMENTS.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Команда и Прогресс</h2>
                <p className="text-gray-400">Анализируйте рост команды и отслеживайте свои достижения.</p>
            </div>

            <div className="border-b border-dark-700">
                <nav className="-mb-px flex gap-4">
                    <button onClick={() => setActiveTab('team')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 ${activeTab === 'team' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
                        <Users className="h-5 w-5"/> Моя Команда
                    </button>
                    <button onClick={() => setActiveTab('achievements')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 ${activeTab === 'achievements' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
                       <Zap className="h-5 w-5"/> Достижения
                    </button>
                </nav>
            </div>
            
            <div className="animate-fade-in">
                {activeTab === 'team' ? renderTeamView() : renderAchievementsView()}
            </div>
        </div>
    );
};

export default TeamProgress;