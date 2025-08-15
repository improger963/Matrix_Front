
import React, { useState } from 'react';
import { MOCK_PROJECT_STATS, MOCK_TRANSACTIONS } from '../constants.ts';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import Stat from './ui/Stat.tsx';
import { AnimatedBalance } from './ui/Stat.tsx';
import LiveFeed from './LiveFeed.tsx';
import DailyTasks from './DailyTasks.tsx';
import { DollarSign, Users, CheckSquare, Copy, Check, BarChart, UserPlus, Grid3X3, Globe, UserCheck, Award, CalendarDays, Gift, Wallet, Shield } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';

const PersonalStat: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; }> = ({ icon, label, value }) => (
    <div className="bg-dark-700/50 p-4 rounded-lg flex items-center gap-4 transition-all hover:bg-dark-700 hover:shadow-lg hover:scale-105">
        <div className="text-brand-accent p-2 bg-dark-800 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <div className="text-lg font-bold text-white">{value}</div>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    const { user, dailyTasks, handleTaskAction, setActiveView, addToast } = useAppContext();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.referralLink);
        addToast("Реферальная ссылка скопирована!", "success");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const referralsForNextLevel = 10;
    const progressPercentage = (user.referrals % referralsForNextLevel) / referralsForNextLevel * 100;
    
    const matrixEarnings = MOCK_TRANSACTIONS
        .filter(t => t.type === 'earning')
        .reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-3 space-y-6">
                <Card className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <UserCheck className="h-6 w-6 text-brand-accent" />
                        <h3 className="text-xl font-bold text-white">Личная статистика</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <PersonalStat icon={<Award className="h-6 w-6"/>} label="Текущий уровень" value={user.level} />
                        <PersonalStat icon={<DollarSign className="h-6 w-6"/>} label="Общий баланс" value={<AnimatedBalance value={user.balance} />} />
                        <PersonalStat icon={<Gift className="h-6 w-6"/>} label="Доход от матриц" value={`$${matrixEarnings.toLocaleString('ru-RU')}`} />
                        <PersonalStat icon={<Users className="h-6 w-6"/>} label="Личные рефералы" value={user.referrals} />
                        <PersonalStat icon={<CheckSquare className="h-6 w-6"/>} label="Закрыто матриц" value={user.matrixCompletions} />
                        <PersonalStat icon={<CalendarDays className="h-6 w-6"/>} label="Дата регистрации" value={new Date(user.joinDate).toLocaleDateString('ru-RU')} />
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-300">Прогресс до уровня {user.level + 1}</p>
                            <p className="text-sm font-bold text-brand-accent">{user.referrals % referralsForNextLevel} / {referralsForNextLevel} рефералов</p>
                        </div>
                        <div className="w-full bg-dark-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-brand-secondary to-brand-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </Card>

                <Card className="!bg-gradient-to-r from-brand-primary to-accent-cyan shadow-xl animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">Ваша реферальная ссылка</h3>
                            <p className="text-brand-accent mt-1">Приглашайте новых участников и получайте бонусы!</p>
                        </div>
                        <div className="flex items-center gap-2 bg-dark-900/50 rounded-lg p-2 w-full md:w-auto">
                            <input 
                                type="text" 
                                readOnly 
                                value={user.referralLink} 
                                className="bg-transparent text-gray-200 focus:outline-none w-full sm:w-auto"
                            />
                            <Button onClick={handleCopy} className="!px-4 !py-2 shrink-0 !bg-dark-900/70 hover:!bg-dark-900">
                                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </Card>
                 <Card className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-xl font-bold text-white mb-4">Быстрые действия</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <button onClick={() => setActiveView('wallet')} className="flex flex-col items-center justify-center gap-2 p-4 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-all">
                            <Wallet className="w-7 h-7 text-brand-accent"/>
                            <span className="font-semibold">Кошелек</span>
                        </button>
                         <button onClick={() => setActiveView('matrix')} className="flex flex-col items-center justify-center gap-2 p-4 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-all">
                            <Shield className="w-7 h-7 text-brand-accent"/>
                            <span className="font-semibold">Матрица</span>
                        </button>
                         <button onClick={() => setActiveView('team')} className="flex flex-col items-center justify-center gap-2 p-4 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-all">
                            <Users className="w-7 h-7 text-brand-accent"/>
                            <span className="font-semibold">Команда</span>
                        </button>
                    </div>
                </Card>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart className="h-6 w-6 text-brand-accent" />
                        <h3 className="text-xl font-bold text-white">Статистика Проекта</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Stat 
                            icon={<Globe className="h-7 w-7 text-blue-400" />}
                            label="Всего участников"
                            value={MOCK_PROJECT_STATS.totalUsers.toLocaleString('ru-RU')}
                        />
                        <Stat 
                            icon={<DollarSign className="h-7 w-7 text-green-400" />}
                            label="Всего заработано"
                            value={`$${MOCK_PROJECT_STATS.totalEarned.toLocaleString('ru-RU')}`}
                        />
                        <Stat 
                            icon={<UserPlus className="h-7 w-7 text-yellow-400" />}
                            label="Новых за сегодня"
                            value={MOCK_PROJECT_STATS.usersToday.toLocaleString('ru-RU')}
                        />
                        <Stat 
                            icon={<Grid3X3 className="h-7 w-7 text-purple-400" />}
                            label="Активных матриц"
                            value={MOCK_PROJECT_STATS.activeMatrices.toLocaleString('ru-RU')}
                        />
                    </div>
                </Card>
                
                <div className="animate-slide-in-up" style={{ animationDelay: '500ms' }}>
                    <DailyTasks tasks={dailyTasks} onTaskAction={handleTaskAction}/>
                </div>

                <div className="animate-slide-in-up" style={{ animationDelay: '600ms' }}>
                    <LiveFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;