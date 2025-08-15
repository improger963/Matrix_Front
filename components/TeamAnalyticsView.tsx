
import React, { useMemo, useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import type { SyndicateMember, AcademyArticle } from '../types.ts';
import { MOCK_SYNDICATE_MEMBERS, MOCK_ACADEMY_ARTICLES } from '../constants.ts';
import { getAITeamAnalysisStream } from '../services/geminiService.ts';
import { BrainCircuit, LoaderCircle, Activity, UserPlus, BarChart3 } from 'lucide-react';

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

const AIAnalyst: React.FC<{ teamData: SyndicateMember[] }> = ({ teamData }) => {
    const [insight, setInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGetAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setInsight('');
        setIsGenerated(false);
        try {
            await getAITeamAnalysisStream(teamData, (chunk) => {
                setInsight(prev => prev + chunk);
            });
            setIsGenerated(true);
        } catch (e: any) {
            setError(e.message || 'Произошла ошибка при анализе.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const formattedInsight = useMemo(() => {
        return insight.split('\n').map((line, i) => {
            if (line.startsWith('**')) {
                return <p key={i} className="font-bold text-white mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.trim().startsWith('*')) {
                return <p key={i} className="flex items-start"><span className="mr-2 mt-1">∙</span><span>{line.substring(1).trim()}</span></p>;
            }
             if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.')) {
                return <p key={i} className="flex items-start"><span className="mr-2 mt-1 font-semibold">{line.substring(0, 2)}</span><span>{line.substring(2).trim()}</span></p>;
            }
            return <p key={i}>{line}</p>;
        });
    }, [insight]);

    return (
        <Card className="lg:col-span-3 !bg-gradient-to-br from-dark-800 to-dark-700 border-dark-600 animate-slide-in-up">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-1/3 text-center">
                    <BrainCircuit className="h-20 w-20 text-brand-primary mx-auto animate-glow" />
                    <h3 className="text-xl font-bold text-white mt-4">AI-Аналитик Команды</h3>
                    <p className="text-sm text-gray-400 mt-1">Получите персональные советы по росту вашей структуры.</p>
                    <Button onClick={handleGetAnalysis} disabled={isLoading} className="mt-4 w-full">
                        {isLoading ? (
                             <span className="flex items-center justify-center">
                                <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                                Анализ...
                            </span>
                        ) : (
                            isGenerated ? 'Запросить снова' : 'Получить AI-анализ'
                        )}
                    </Button>
                </div>
                <div className="w-full md:w-2/3 min-h-[220px] bg-dark-900/50 p-4 rounded-lg border border-dark-700 flex items-center justify-center">
                    {isLoading && <p className="text-gray-400">Анализирую данные вашей команды...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && (
                         <div className="text-sm text-gray-300 space-y-1 w-full">
                           {insight ? formattedInsight : <p className="text-center text-gray-500">Нажмите кнопку, чтобы получить рекомендации</p>}
                        </div>
                    )}
                </div>
            </div>
        </Card>
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
    topReferrers: SyndicateMember[];
    insights: { icon: React.ElementType; text: string; type: string }[];
  };
}

const TeamAnalyticsView: React.FC<TeamAnalyticsViewProps> = ({ teamAnalytics }) => {
    const { performanceScore, activityRate, newLast7Days, averageLevel, activeCount, inactiveCount, topReferrers, insights } = teamAnalytics;
    return (
        <div className="space-y-6">
            <AIAnalyst teamData={MOCK_SYNDICATE_MEMBERS} />
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
                                <div className="text-right"><p className="font-bold text-brand-accent text-lg">{member.investors}</p><p className="text-xs text-gray-500">инвесторов</p></div>
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

export default TeamAnalyticsView;