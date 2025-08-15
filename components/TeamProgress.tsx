
import React, { useState, useMemo } from 'react';
import { MOCK_TEAM_MEMBERS, MOCK_ACHIEVEMENTS } from '../constants.ts';
import { Users, BarChart3, Zap, Award, GraduationCap, Flame, Rocket } from 'lucide-react';

import TeamAnalyticsView from './TeamAnalyticsView.tsx';
import TeamListView from './TeamListView.tsx';
import TeamAchievementsView from './TeamAchievementsView.tsx';

type Tab = 'analytics' | 'team' | 'achievements';

interface TeamProgressProps {
    initialTab?: string | null;
}

const TeamProgress: React.FC<TeamProgressProps> = ({ initialTab }) => {
    const isValidTab = (tab: string | null | undefined): tab is Tab => {
        return tab === 'analytics' || tab === 'team' || tab === 'achievements';
    };
    
    const [activeTab, setActiveTab] = useState<Tab>(isValidTab(initialTab) ? initialTab : 'analytics');

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

    const achievementStats = useMemo(() => {
        const unlockedCount = MOCK_ACHIEVEMENTS.filter(a => a.unlocked).length;
        const totalCount = MOCK_ACHIEVEMENTS.length;
        return {
            unlockedCount,
            totalCount,
            progress: totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0
        };
    }, []);

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
                {activeTab === 'analytics' && <TeamAnalyticsView teamAnalytics={teamAnalytics} />}
                {activeTab === 'team' && <TeamListView />}
                {activeTab === 'achievements' && <TeamAchievementsView achievementStats={achievementStats} />}
            </div>
        </div>
    );
};

export default TeamProgress;
