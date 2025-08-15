

import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { MOCK_CAPITAL_HISTORY_30_DAYS, MOCK_MARKET_PULSE, MOCK_LIVE_FEED_EVENTS } from '../constants.ts';
import { AnimatedBalance } from './ui/Stat.tsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, Briefcase, TrendingUp, Activity, PieChart, Target, Zap, UserPlus, ShieldCheck, ChevronsUp, DollarSign, BarChart, Rocket } from 'lucide-react';


const ActiveMission: React.FC = () => {
    const { tasks, setActiveView, handleTaskAction, user } = useAppContext();
    const activeMission = tasks.find(t => !t.isCompleted && (t.category === 'onboarding' || t.category === 'mission')) || tasks.find(t => !t.isCompleted);
    
    if (!activeMission) {
        return (
             <Card className="animate-slide-in-up !bg-gradient-to-br !from-dark-800 !to-dark-700 border-dark-600 lg:col-span-5">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Все миссии выполнены, {user.name.split(' ')[0]}!</h2>
                        <p className="text-gray-400 mt-1">Отличная работа! Новые задачи появятся в ближайшее время.</p>
                    </div>
                    <Button onClick={() => setActiveView('tasks')} className="animate-glow">
                        <Target className="w-5 h-5 mr-2" />
                        <span>Центр Миссий</span>
                    </Button>
                </div>
            </Card>
        );
    }
    
    const progress = activeMission.progress ? (activeMission.progress.current / activeMission.progress.target) * 100 : 0;

    return (
        <Card className="animate-slide-in-up !bg-gradient-to-br !from-brand-primary/20 !to-dark-800/20 border-brand-primary/50 lg:col-span-5">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <p className="text-sm font-bold uppercase tracking-wider text-brand-accent">Активная миссия</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{activeMission.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">{activeMission.description}</p>
                    
                    {activeMission.progress && (
                        <div className="mt-4">
                             <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Прогресс</span>
                                <span>{activeMission.progress.current}/{activeMission.progress.target}</span>
                            </div>
                             <div className="w-full bg-dark-900/50 rounded-full h-2">
                                <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
                 <div className="w-full md:w-auto flex flex-col items-stretch md:items-end text-right">
                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-300 flex items-center gap-1.5 self-end mb-3">
                       <Zap className="w-5 h-5" /> +{activeMission.reward} XP
                    </div>
                    <Button onClick={() => handleTaskAction(activeMission)} className="w-full">
                        {activeMission.actionText} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                 </div>
            </div>
        </Card>
    );
};

const CapitalOverview: React.FC = () => {
    const { user } = useAppContext();
    const [timeframe, setTimeframe] = useState(30);
    const data = MOCK_CAPITAL_HISTORY_30_DAYS.slice(MOCK_CAPITAL_HISTORY_30_DAYS.length - timeframe, MOCK_CAPITAL_HISTORY_30_DAYS.length);


    return (
        <Card className="lg:col-span-3 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-6 h-6 text-brand-primary" /> Обзор Капитала</h3>
                 <div className="flex items-center gap-1 bg-dark-800 p-1 rounded-lg">
                    {[7, 30, 90].map(d => (
                        <button key={d} onClick={() => setTimeframe(d > MOCK_CAPITAL_HISTORY_30_DAYS.length ? MOCK_CAPITAL_HISTORY_30_DAYS.length : d)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${timeframe === d ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-dark-700'}`}>{d}д</button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                     <p className="text-sm text-gray-400">Текущий баланс</p>
                    <div className="text-3xl font-bold text-white">
                        <AnimatedBalance value={user.capital} />
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Прибыль за 24ч</p>
                    <p className="text-xl font-bold text-accent-green">+$152.70 CAP</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">Прогноз дохода (AI)</p>
                    <p className="text-xl font-bold text-cyan-400">~$780 CAP / неделя</p>
                </div>
            </div>
            <div className="w-full h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            labelStyle={{ color: '#cbd5e1' }}
                            itemStyle={{ fontWeight: 'bold' }}
                            formatter={(value) => [`$${(value as number).toFixed(2)} CAP`, 'Баланс']}
                        />
                        <Area type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const PortfolioWidget: React.FC = () => {
    const { setActiveView, portfolio } = useAppContext();
    return (
        <Card className="lg:col-span-2 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Briefcase className="w-6 h-6 text-brand-primary" /> Портфель Стартапов</h3>
            <div className="space-y-4">
                {portfolio.map(startup => (
                    <div key={startup.id} className="p-3 bg-dark-700/50 rounded-lg">
                         <div className="flex items-center justify-between">
                            <p className="font-semibold text-white">{startup.name}</p>
                            <p className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: startup.stage.color + '20', color: startup.stage.color }}>{startup.stage.name}</p>
                         </div>
                         <div className="flex items-center gap-2 mt-2">
                             {startup.progress.map((p, i) => (
                                <div key={i} className="flex-1 bg-dark-900 h-1.5 rounded-full"><div className="bg-brand-primary h-1.5 rounded-full" style={{width: `${p}%`}}></div></div>
                             ))}
                         </div>
                         <p className="text-xs text-gray-400 mt-2">
                            <span className="font-semibold text-brand-accent">Следующая веха: </span>{startup.nextMilestone}
                         </p>
                    </div>
                ))}
            </div>
             <Button onClick={() => setActiveView('market')} variant="secondary" className="w-full mt-4">
                Управлять портфелем <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Card>
    );
};

const TickerFeed: React.FC = () => {
    const events = MOCK_LIVE_FEED_EVENTS.slice(0, 5);
    const eventIcons: Record<string, React.ReactNode> = {
        registration: <UserPlus className="h-4 w-4 text-blue-400" />,
        new_level: <ChevronsUp className="h-4 w-4 text-yellow-400" />,
        startup_exit: <ShieldCheck className="h-4 w-4 text-purple-400" />,
        upgrade: <BarChart className="h-4 w-4 text-cyan-400"/>
    }
    return (
        <Card className="lg:col-span-2 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-6 h-6 text-brand-primary" /> Активность Синдиката</h3>
            <div className="space-y-3 overflow-hidden">
                {events.map((event, i) => (
                    <div key={event.id} className="flex items-center gap-3 text-sm animate-slide-in-up" style={{animationDelay: `${i*100}ms`}}>
                        <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center flex-shrink-0">{eventIcons[event.type] || <Zap className="h-4 w-4 text-gray-400"/>}</div>
                        <p className="text-gray-300 flex-1 truncate">
                           <span className="font-semibold text-white">{event.user.name}</span>
                           {event.type === 'startup_exit' && ` закрыл раунд с прибылью ${event.amount}$`}
                           {event.type === 'new_level' && ` достиг уровня ${event.level}`}
                           {event.type === 'registration' && ` присоединился к проекту`}
                           {event.type === 'upgrade' && ` улучшил стартап до Раунда B`}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const MarketPulse: React.FC = () => {
    const { setActiveView } = useAppContext();
    return (
        <Card className="lg:col-span-3 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><PieChart className="w-6 h-6 text-brand-primary" /> Пульс Рынка</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOCK_MARKET_PULSE.map(sector => (
                    <div key={sector.id} className={`p-4 rounded-lg border-2 transition-all ${sector.isTrending ? 'border-brand-primary bg-dark-700 animate-card-glow' : 'border-dark-700 bg-dark-800'}`}>
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-white">{sector.name}</h4>
                            {sector.isTrending && <span className="text-xs font-bold text-brand-primary animate-pulse">TRENDING</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-3">
                            <div>Средний ROI: <p className="font-bold text-accent-green text-base">{sector.avgROI}%</p></div>
                             <div>Время до Exit: <p className="font-bold text-white text-base">{sector.avgExitTime} д.</p></div>
                        </div>
                    </div>
                ))}
             </div>
             <Button onClick={() => setActiveView('market')} variant="secondary" className="w-full mt-4">
                Перейти на рынок <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Card>
    )
}

const DashboardView: React.FC = () => {
    const { portfolio, setActiveView } = useAppContext();

    if (portfolio.length === 0) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                 <Card className="animate-slide-in-up !bg-gradient-to-br from-brand-primary/20 to-dark-800/20 border-brand-primary/50 text-center p-8 lg:col-span-5">
                     <h2 className="text-3xl font-bold text-white">Добро пожаловать в Nexus Capital!</h2>
                    <p className="text-gray-400 mt-2 max-w-lg mx-auto">Ваш командный центр готов. Сделайте свой первый шаг — активируйте стартовый портфель, чтобы начать свой путь к вершине.</p>
                     <Button onClick={() => setActiveView('market')} className="mt-6 animate-glow">
                        <Rocket className="w-5 h-5 mr-2" />
                        Активировать первый стартап
                    </Button>
                </Card>
                <CapitalOverview />
                <MarketPulse />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <ActiveMission />
            <CapitalOverview />
            <PortfolioWidget />
            <TickerFeed />
            <MarketPulse />
        </div>
    );
};

export default DashboardView;