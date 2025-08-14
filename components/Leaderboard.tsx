import React from 'react';
import Card from './ui/Card';
import { MOCK_LEADERS } from '../constants';
import { Leader, User } from '../types';
import { Crown, Trophy, Award, DollarSign, BarChart2 } from 'lucide-react';

const PodiumPlace: React.FC<{ leader: Leader; place: 1 | 2 | 3 }> = ({ leader, place }) => {
    const styles = {
        1: {
            height: 'h-48',
            bgColor: 'bg-yellow-400/20',
            borderColor: 'border-yellow-400',
            textColor: 'text-yellow-400',
            icon: <Crown className="h-8 w-8" />
        },
        2: {
            height: 'h-40',
            bgColor: 'bg-gray-400/20',
            borderColor: 'border-gray-400',
            textColor: 'text-gray-300',
            icon: <Trophy className="h-7 w-7" />
        },
        3: {
            height: 'h-32',
            bgColor: 'bg-yellow-600/20',
            borderColor: 'border-yellow-600',
            textColor: 'text-yellow-600',
            icon: <Award className="h-6 w-6" />
        }
    };
    const style = styles[place];

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${place === 1 ? '-mx-4 z-10' : ''}`}>
                 <img src={leader.avatarUrl} alt={leader.name} className={`h-20 w-20 rounded-full border-4 ${style.borderColor} mb-2`} />
                 <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${style.textColor}`}>{style.icon}</div>
            </div>
            <p className="font-bold text-white text-lg truncate">{leader.name}</p>
            <p className={`font-bold text-xl ${style.textColor}`}>${leader.earnings.toLocaleString('ru-RU')}</p>
            <div className={`mt-2 flex-grow w-full rounded-t-lg ${style.bgColor} ${style.borderColor} border-t-4 flex flex-col justify-center items-center p-2 ${style.height}`}>
                <p className={`font-black text-6xl ${style.textColor}`}>{place}</p>
            </div>
        </div>
    );
}

const LeaderRow: React.FC<{ leader: Leader; isCurrentUser: boolean }> = ({ leader, isCurrentUser }) => {
     return (
        <tr className={`border-b border-dark-700 last:border-b-0 transition-colors ${isCurrentUser ? 'bg-brand-primary/20' : 'hover:bg-dark-700/50'}`}>
            <td className="p-4 font-bold text-lg text-center w-24">
                <span className={isCurrentUser ? 'text-brand-accent' : 'text-white'}>{leader.rank}</span>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <img src={leader.avatarUrl} alt={leader.name} className="h-10 w-10 rounded-full" />
                    <span className="font-medium text-white">{leader.name} {isCurrentUser && '(Вы)'}</span>
                </div>
            </td>
            <td className="p-4 font-semibold text-green-400">${leader.earnings.toLocaleString('ru-RU')}</td>
            <td className="p-4 font-medium text-white">{leader.level}</td>
        </tr>
     );
};


const Leaderboard: React.FC<{ user: User }> = ({ user }) => {
    const [top3, others] = [MOCK_LEADERS.slice(0, 3), MOCK_LEADERS.slice(3)];
    const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd

    return (
        <Card className="animate-slide-in-up">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-8 w-8 text-brand-primary" />
                <div>
                     <h2 className="text-2xl font-bold text-white">Таблица лидеров</h2>
                     <p className="text-gray-400">Лучшие из лучших в нашем проекте.</p>
                </div>
            </div>
           
            {/* Desktop View */}
            <div className="hidden md:block">
                 {podiumOrder[1] && (
                    <div className="flex items-end justify-center gap-4 h-64 mb-10">
                       {podiumOrder[0] && <PodiumPlace leader={podiumOrder[0]} place={2} />}
                       {podiumOrder[1] && <PodiumPlace leader={podiumOrder[1]} place={1} />}
                       {podiumOrder[2] && <PodiumPlace leader={podiumOrder[2]} place={3} />}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-dark-700">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-400 w-24 text-center">Ранг</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Участник</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Доход</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Уровень</th>
                            </tr>
                        </thead>
                        <tbody>
                            {others.map((leader) => (
                                <LeaderRow key={leader.id} leader={leader} isCurrentUser={leader.id === user.id}/>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Mobile View */}
            <div className="md:hidden space-y-3">
                 {MOCK_LEADERS.map((leader) => (
                    <div key={leader.id} className={`p-4 rounded-lg flex items-center gap-4 border ${leader.id === user.id ? 'border-brand-primary bg-brand-primary/20' : 'border-dark-700 bg-dark-700/50'}`}>
                        <div className="w-8 text-center font-bold text-lg">{leader.rank}</div>
                        <img src={leader.avatarUrl} alt={leader.name} className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                            <p className="font-bold text-white">{leader.name} {leader.id === user.id && '(Вы)'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                <span>Ур: {leader.level}</span>
                                <span className="text-green-400 font-semibold">${leader.earnings.toLocaleString('ru-RU')}</span>
                            </div>
                        </div>
                    </div>
                 ))}
            </div>

        </Card>
    );
};

export default Leaderboard;