
import React from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import type { Partner, NetworkGoal } from '../types.ts';
import { MOCK_NETWORK_GOAL } from '../constants.ts';
import { BrainCircuit, Activity, UserPlus, BarChart3, Target, Edit } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';

const NetworkGoals: React.FC<{ goal: NetworkGoal }> = ({ goal }) => {
    const { setActiveView } = useAppContext();
    const progressPercentage = (goal.progress / goal.target) * 100;
    const daysLeft = Math.round((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

    return (
        <Card className="lg:col-span-3 !bg-gradient-to-br from-brand-primary/20 to-dark-800/10 border-brand-primary/50">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                 <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Target className="w-6 h-6 text-brand-accent" /> Цель Бизнес-сети</h3>
                    <p className="text-2xl font-semibold text-white mt-2">{goal.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
                 </div>
                 <Button variant="secondary" className="!text-xs !px-3 !py-1.5" onClick={() => setActiveView('tasks')}><Edit className="w-4 h-4 mr-1.5"/>Управлять целями</Button>
            </div>
           
            <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-white">Прогресс: {goal.progress} / {goal.target}</span>
                    <span className="text-gray-400">Осталось: {daysLeft} дней</span>
                </div>
                <div className="w-full bg-dark-900/50 rounded-full h-3">
                    <div className="bg-gradient-to-r from-brand-secondary to-brand-primary h-3 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                 <p className="text-xs text-center text-gray-400 mt-2">Награда за выполнение: <span className="font-bold text-accent-gold">{goal.reward}</span></p>
            </div>
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


interface TeamAnalyticsViewProps {
  teamAnalytics: {
    activeCount: number;
    inactiveCount: number;
    activityRate: number;
    newLast7Days: number;
    averageLevel: number;
    performanceScore: number;
    topReferrers: Partner[];
    insights: { icon: React.ElementType; text: string; type: string }[];
  };
}

const NetworkAnalyticsView: React.FC<TeamAnalyticsViewProps> = ({ teamAnalytics }) => {
    const { performanceScore, activityRate, newLast7Days, averageLevel, activeCount, inactiveCount, topReferrers } = teamAnalytics;
    return (
        <div className="space-y-6">
             <NetworkGoals goal={MOCK_NETWORK_GOAL} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center p-6 animate-slide-in-up">
                    <h3 className="text-lg font-bold text-white mb-4">Эффективность Бизнес-сети</h3>
                    <GaugeChart score={performanceScore} />
                    <p className="text-sm text-gray-400 mt-4">Оценка на основе активности и среднего уровня партнеров.</p>
                </Card>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                        <AnalyticsStatCard icon={<Activity className="w-6 h-6 text-green-400" />} label="Активность" value={`${activityRate.toFixed(0)}%`} note={`${activeCount} из ${activeCount + inactiveCount} партнеров`} />
                    </div>
                    <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                        <AnalyticsStatCard icon={<UserPlus className="w-6 h-6 text-cyan-400" />} label="Рост за 7 дней" value={`+${newLast7Days}`} note="Новых партнеров" />
                    </div>
                    <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
                        <AnalyticsStatCard icon={<BarChart3 className="w-6 h-6 text-purple-400" />} label="Средний уровень" value={`${averageLevel.toFixed(1)}`} note="Общий опыт команды" />
                    </div>
                    <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                        <Card className="!bg-dark-800/50 flex flex-col justify-center items-center">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Состав Бизнес-сети</h4>
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
                                <div className="text-right"><p className="font-bold text-brand-accent text-lg">{member.partners}</p><p className="text-xs text-gray-500">партнеров</p></div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="animate-slide-in-up" style={{ animationDelay: '600ms' }}>
                    <h3 className="text-xl font-bold text-white mb-4">💡 AI Советы от N.C.A.</h3>
                     <p className="text-sm text-gray-400 mb-4">Подробный анализ и персональные рекомендации доступны в вашем AI-Ассистенте.</p>
                     <Button variant="secondary" className="w-full">
                        <BrainCircuit className="w-4 h-4 mr-2" />
                        Открыть N.C.A.
                     </Button>
                </Card>
            </div>
        </div>
    );
};

export default NetworkAnalyticsView;
