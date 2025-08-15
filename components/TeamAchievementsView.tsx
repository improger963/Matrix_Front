
import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import type { Achievement } from '../types.ts';
import { MOCK_ACHIEVEMENTS } from '../constants.ts';
import { Zap, CheckCircle } from 'lucide-react';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const { unlocked, icon: Icon, title, description, progress, category } = achievement;
    const progressPercentage = progress ? (progress.current / progress.target) * 100 : 0;

    const categoryStyles: Record<Achievement['category'], { text: string, bg: string }> = {
        Team: { text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        Financial: { text: 'text-green-400', bg: 'bg-green-500/10' },
        Personal: { text: 'text-purple-400', bg: 'bg-purple-500/10' },
        Milestone: { text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    };

    return (
        <Card className={`!p-4 flex flex-col justify-between gap-4 transition-all duration-300 h-full ${unlocked ? 'bg-dark-700 animate-card-glow border-brand-primary/50' : 'bg-dark-800/50 opacity-60'}`}>
            <div>
                <div className="flex items-start justify-between">
                    <div className={`relative flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${unlocked ? 'bg-brand-primary/20' : 'bg-dark-700'}`}>
                        <Icon className={`h-8 w-8 ${unlocked ? 'text-brand-primary' : 'text-gray-500'}`} />
                        {unlocked && <CheckCircle className="absolute -top-2 -right-2 h-6 w-6 text-green-400 bg-dark-700 rounded-full" />}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${categoryStyles[category].bg} ${categoryStyles[category].text}`}>{category}</span>
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

interface TeamAchievementsViewProps {
  achievementStats: {
    unlockedCount: number;
    totalCount: number;
    progress: number;
  };
}

const TeamAchievementsView: React.FC<TeamAchievementsViewProps> = ({ achievementStats }) => {
    const [achievementCategory, setAchievementCategory] = useState<string>('all');
    
    const achievementCategories = ['all', ...Array.from(new Set(MOCK_ACHIEVEMENTS.map(a => a.category)))];

    const filteredAchievements = MOCK_ACHIEVEMENTS.filter(a => achievementCategory === 'all' || a.category === achievementCategory);

    return (
        <div className="space-y-6">
             <Card>
                <h3 className="text-xl font-bold text-white mb-4">Общий прогресс достижений</h3>
                <div className="flex items-center gap-4 bg-dark-800/50 p-4 rounded-lg">
                    <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-300">Разблокировано</p>
                            <p className="text-sm font-bold text-brand-accent">{achievementStats.unlockedCount} / {achievementStats.totalCount}</p>
                        </div>
                        <div className="w-full bg-dark-900 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-brand-secondary to-brand-primary h-2.5 rounded-full" style={{ width: `${achievementStats.progress}%` }}></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <Zap className="h-8 w-8 text-yellow-400 mx-auto"/>
                        <p className="text-sm text-gray-400 mt-1">Награда за все</p>
                    </div>
                </div>
            </Card>
            <Card>
                 <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-sm font-semibold mr-2">Категории:</span>
                    {achievementCategories.map(cat => (
                         <button key={cat} onClick={() => setAchievementCategory(cat)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${achievementCategory === cat ? 'bg-brand-primary text-white' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}>
                            {cat === 'all' ? 'Все' : cat}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAchievements
                        .sort((a,b) => (a.unlocked ? -1 : 1) - (b.unlocked ? -1 : 1))
                        .map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
                </div>
            </Card>
        </div>
    );
};

export default TeamAchievementsView;
