import React from 'react';
import Card from './ui/Card';
import { MOCK_LEADERS } from '../constants';
import { Leader } from '../types';
import { Crown, Award, DollarSign, Trophy } from 'lucide-react';

const LeaderCard: React.FC<{ leader: Leader }> = ({ leader }) => {
    const rankColors: { [key: number]: string } = {
        1: 'border-yellow-400 bg-yellow-400/10',
        2: 'border-gray-400 bg-gray-400/10',
        3: 'border-yellow-600 bg-yellow-600/10'
    };
    const rankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400"/>;
        if (rank === 2) return <Trophy className="h-6 w-6 text-gray-300"/>;
        if (rank === 3) return <Award className="h-6 w-6 text-yellow-600"/>;
        return <span className="font-bold text-lg">{rank}</span>;
    };
    
    return (
        <div className={`p-4 rounded-lg flex items-center gap-4 border ${rankColors[leader.rank] || 'border-dark-700 bg-dark-700/50'}`}>
            <div className="w-8 text-center">{rankIcon(leader.rank)}</div>
            <img src={leader.avatarUrl} alt={leader.name} className="h-12 w-12 rounded-full" />
            <div className="flex-1">
                <p className="font-bold text-white">{leader.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <span>Ур: {leader.level}</span>
                    <span className="text-green-400 font-semibold">${leader.earnings.toLocaleString('ru-RU')}</span>
                </div>
            </div>
        </div>
    );
};


const Leaderboard: React.FC = () => {
    const rankColors: { [key: number]: string } = {
        1: 'text-yellow-400',
        2: 'text-gray-300',
        3: 'text-yellow-600'
    };

    return (
        <Card className="animate-slide-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Таблица лидеров</h2>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
                 {MOCK_LEADERS.map((leader) => <LeaderCard key={leader.rank} leader={leader} />)}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-dark-700">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-400 w-24 text-center">Ранг</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Участник</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Доход</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Уровень</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_LEADERS.map((leader) => (
                            <tr key={leader.rank} className="border-b border-dark-700 last:border-b-0 hover:bg-dark-700/50 transition-colors">
                                <td className="p-4 font-bold text-lg text-center">
                                    <span className={rankColors[leader.rank] || 'text-white'}>
                                        {leader.rank === 1 ? <Crown className="inline-block h-6 w-6 mb-1"/> : leader.rank}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={leader.avatarUrl} alt={leader.name} className="h-10 w-10 rounded-full" />
                                        <span className="font-medium text-white">{leader.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 font-semibold text-green-400">${leader.earnings.toLocaleString('ru-RU')}</td>
                                <td className="p-4 font-medium text-white">{leader.level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default Leaderboard;