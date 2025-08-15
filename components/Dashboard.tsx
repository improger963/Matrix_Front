
import React, { useState } from 'react';
import { MOCK_PROJECT_STATS, MOCK_EARNINGS_7_DAYS, MOCK_TRANSACTIONS } from '../constants.ts';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import Stat, { AnimatedBalance } from './ui/Stat.tsx';
import LiveFeed from './LiveFeed.tsx';
import DailyTasks from './DailyTasks.tsx';
import { DollarSign, Users, CheckSquare, Copy, Check, BarChart, UserPlus, Grid3X3, Globe, UserCheck, Award, TrendingUp, Shield, BotMessageSquare, Target, Eye, ExternalLink } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';

const WelcomeBanner: React.FC<{ user: any; setActiveView: (view: any) => void }> = ({ user, setActiveView }) => (
    <Card className="animate-slide-in-up !bg-gradient-to-br !from-dark-800 !to-dark-700 border-dark-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Добро пожаловать, {user.name.split(' ')[0]}!</h2>
                <p className="text-gray-400 mt-1">Ваш командный центр. Все показатели в норме и готовы к росту.</p>
            </div>
            <Button onClick={() => setActiveView('tasks')} className="animate-glow">
                <Target className="w-5 h-5 mr-2" />
                <span>Перейти к заданиям</span>
            </Button>
        </div>
    </Card>
);

const UserHub: React.FC<{ user: any; matrixEarnings: number }> = ({ user, matrixEarnings }) => {
    const referralsForNextLevel = 10;
    const progressPercentage = (user.referrals % referralsForNextLevel) / referralsForNextLevel * 100;

    return (
        <Card className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-4">
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-4 border-brand-secondary" />
                <div>
                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                    <p className="text-brand-accent font-semibold">Уровень {user.level}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-center">
                <div className="bg-dark-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Баланс</p>
                    <AnimatedBalance value={user.balance} className="text-lg text-green-400" />
                </div>
                <div className="bg-dark-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Рефералы</p>
                    <p className="text-lg font-bold text-white">{user.referrals}</p>
                </div>
                <div className="bg-dark-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Матрицы</p>
                    <p className="text-lg font-bold text-white">{user.matrixCompletions}</p>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-300">Прогресс до уровня {user.level + 1}</p>
                    <p className="text-sm font-bold text-brand-accent">{user.referrals % referralsForNextLevel} / {referralsForNextLevel}</p>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-brand-secondary to-brand-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
        </Card>
    );
};

const EarningsChart: React.FC<{ data: { day: string, earnings: number }[] }> = ({ data }) => {
    const maxEarnings = Math.max(...data.map(d => d.earnings), 0);
    const chartHeight = 120;
    const chartWidth = 400;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * chartWidth;
        const y = chartHeight - (d.earnings / maxEarnings) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    const areaPath = `M0,${chartHeight} L${points} L${chartWidth},${chartHeight} Z`;
    const totalEarnings = data.reduce((sum, d) => sum + d.earnings, 0);
    const bestDay = data.reduce((max, d) => d.earnings > max.earnings ? d : max, data[0]);

    return (
        <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Аналитика Доходов</h3>
                    <p className="text-sm text-gray-400">За последние 7 дней</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">+${totalEarnings.toLocaleString('ru-RU')}</p>
                    <p className="text-xs text-gray-400">Лучший день: ${bestDay.earnings} ({bestDay.day})</p>
                </div>
            </div>
            <div className="relative h-40">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#earningsGradient)" />
                    <polyline
                        points={points}
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-draw-line"
                        strokeDasharray="1000"
                    />
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * chartWidth;
                        const y = chartHeight - (d.earnings / maxEarnings) * chartHeight;
                        return (
                             <g key={i}>
                                <text x={x} y={chartHeight + 15} textAnchor="middle" fill="#9ca3af" fontSize="12">{d.day}</text>
                                 <circle cx={x} cy={y} r="4" fill="#1e293b" stroke="#c4b5fd" strokeWidth="2" className="transition-opacity opacity-0 hover:opacity-100" />
                            </g>
                        );
                    })}
                </svg>
            </div>
        </Card>
    );
};

const MatrixSnapshot: React.FC<{ setActiveView: (view: any) => void }> = ({ setActiveView }) => {
    const filled = 5;
    const total = 6;
    return (
         <Card className="animate-slide-in-up flex flex-col justify-between" style={{ animationDelay: '100ms' }}>
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Снимок Матрицы</h3>
                <div className="flex justify-center items-center mb-4">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-brand-primary rounded-full border-2 border-brand-accent animate-pulse"></div>
                        <div className="flex gap-8 mt-4">
                           <div className="w-10 h-10 bg-dark-700 rounded-full border-2 border-purple-400"></div>
                           <div className="w-10 h-10 bg-dark-700 rounded-full border-2 border-purple-400"></div>
                        </div>
                    </div>
                </div>
                <p className="text-center text-gray-300">Заполнено <span className="font-bold text-white">{filled} / {total}</span> мест</p>
                 <div className="w-full bg-dark-700 rounded-full h-2.5 mt-2">
                    <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${(filled/total)*100}%` }}></div>
                </div>
            </div>
            <Button onClick={() => setActiveView('matrix')} variant="secondary" className="w-full mt-6">
                <Eye className="w-4 h-4 mr-2" />
                Перейти в матрицу
            </Button>
        </Card>
    );
}

const ReferralActions: React.FC<{ user: any, setActiveView: (view: any) => void, addToast: any }> = ({ user, setActiveView, addToast }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(user.referralLink);
        addToast("Реферальная ссылка скопирована!", "success");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold text-white mb-4">Инструменты Роста</h3>
            <div className="space-y-4">
                 <div>
                     <p className="text-sm font-medium text-gray-300 mb-1">Ваша ссылка для приглашений</p>
                     <div className="flex items-center gap-2">
                        <input type="text" readOnly value={user.referralLink} className="truncate bg-dark-900/50 p-2 rounded-lg border border-dark-600 w-full text-sm"/>
                        <Button onClick={handleCopy} className="!px-3 !py-2 shrink-0">
                            {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-300 mb-2">Быстрые действия</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setActiveView('wallet')} className="flex flex-col items-center gap-1.5 p-2 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors"><DollarSign className="w-6 h-6 text-brand-accent"/> <span className="text-xs">Финансы</span></button>
                        <button onClick={() => setActiveView('team')} className="flex flex-col items-center gap-1.5 p-2 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors"><Users className="w-6 h-6 text-brand-accent"/> <span className="text-xs">Команда</span></button>
                        <button onClick={() => setActiveView('marketing')} className="flex flex-col items-center gap-1.5 p-2 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors"><BotMessageSquare className="w-6 h-6 text-brand-accent"/> <span className="text-xs">AI-Помощник</span></button>
                    </div>
                </div>
            </div>
        </Card>
    )
};

const ProjectStatsBar: React.FC<{ stats: any }> = ({ stats }) => {
    const statItems = [
        { icon: <Globe className="h-6 w-6 text-blue-400" />, label: "Всего участников", value: stats.totalUsers.toLocaleString('ru-RU') },
        { icon: <DollarSign className="h-6 w-6 text-green-400" />, label: "Всего заработано", value: `$${stats.totalEarned.toLocaleString('ru-RU')}` },
        { icon: <UserPlus className="h-6 w-6 text-yellow-400" />, label: "Новых за сегодня", value: stats.usersToday.toLocaleString('ru-RU') },
        { icon: <Grid3X3 className="h-6 w-6 text-purple-400" />, label: "Активных матриц", value: stats.activeMatrices.toLocaleString('ru-RU') },
    ];

    return (
        <Card className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                        {item.icon}
                        <div>
                            <p className="text-sm text-gray-400">{item.label}</p>
                            <p className="text-lg font-bold text-white">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};


const Dashboard: React.FC = () => {
    const { user, tasks, handleTaskAction, setActiveView, addToast } = useAppContext();
    
    const dailyTasks = tasks.filter(task => task.category === 'daily');
    
    const matrixEarnings = MOCK_TRANSACTIONS
        .filter(t => t.type === 'earning')
        .reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-3 space-y-6">
                <WelcomeBanner user={user} setActiveView={setActiveView} />
                <UserHub user={user} matrixEarnings={matrixEarnings} />
                <EarningsChart data={MOCK_EARNINGS_7_DAYS} />
                <ProjectStatsBar stats={MOCK_PROJECT_STATS} />
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-2 space-y-6">
                <MatrixSnapshot setActiveView={setActiveView} />
                <ReferralActions user={user} setActiveView={setActiveView} addToast={addToast} />
                <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
                    <DailyTasks tasks={dailyTasks} onTaskAction={handleTaskAction}/>
                </div>
                <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                    <LiveFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
