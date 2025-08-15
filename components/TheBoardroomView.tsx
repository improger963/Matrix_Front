

import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import type { BoardroomMember, BoardroomVote } from '../types.ts';
import { MOCK_BOARDROOM_DATA } from '../constants.ts';
import { Award, DollarSign, Users, BarChart, Check, Info } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';

const MemberRow: React.FC<{ member: BoardroomMember; isCurrentUser: boolean }> = ({ member, isCurrentUser }) => (
    <div className={`flex items-center p-3 rounded-lg ${isCurrentUser ? 'bg-brand-primary/20' : 'bg-dark-700/50'}`}>
        <div className="w-10 text-center font-bold text-lg text-white">{member.rank}</div>
        <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full mx-4" />
        <div className="flex-1">
            <p className="font-bold text-white">{member.name}</p>
            <p className="text-xs text-gray-400">Влияние: {member.influence}</p>
        </div>
        <div className="text-right">
            <p className="font-semibold text-accent-green">{`$${Number(member.earnings || 0).toLocaleString('ru-RU')}`}</p>
            <p className="text-xs text-gray-400">Доход (30д)</p>
        </div>
    </div>
);

const VoteCard: React.FC<{ vote: BoardroomVote }> = ({ vote: initialVote }) => {
    const [vote, setVote] = useState(initialVote);
    const [selectedOption, setSelectedOption] = useState<string | null>(vote.userVote || null);
    
    const handleVote = (optionId: string) => {
        if (vote.userVote) return; // Already voted
        
        setSelectedOption(optionId);
        
        // Simulate vote update
        const newVote = { ...vote };
        newVote.userVote = optionId;
        newVote.totalVotes += 1;
        const option = newVote.options.find(o => o.id === optionId);
        if (option) option.votes += 1;
        
        setVote(newVote);
    };

    return (
        <Card className="!bg-dark-700/50">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white">{vote.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{vote.description}</p>
                </div>
                <div className="text-right text-xs">
                     <p className="text-gray-400">Завершится через:</p>
                     <p className="font-semibold text-yellow-400">2 дня 5 часов</p>
                </div>
            </div>
            <div className="space-y-3 mt-4">
                {vote.options.map(option => {
                    const percentage = vote.totalVotes > 0 ? (option.votes / vote.totalVotes) * 100 : 0;
                    const isSelected = selectedOption === option.id;

                    return (
                        <div key={option.id} onClick={() => handleVote(option.id)} className={`p-3 rounded-lg border-2 transition-all ${isSelected ? 'border-brand-primary bg-dark-800' : 'border-transparent bg-dark-800 hover:bg-dark-700 cursor-pointer'}`}>
                             <div className="flex justify-between items-center text-sm mb-1">
                                <p className="font-semibold text-white flex items-center">{option.text} {isSelected && <Check className="w-4 h-4 ml-2 text-green-400"/>}</p>
                                <p className="font-bold text-gray-300">{percentage.toFixed(1)}%</p>
                            </div>
                            <div className="w-full bg-dark-900 rounded-full h-2">
                                <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">Всего голосов: {vote.totalVotes}</p>
        </Card>
    );
};

const TheBoardroomView: React.FC = () => {
    const { user } = useAppContext();
    const { members, globalBonusPool, activeVote } = MOCK_BOARDROOM_DATA;
    const isUserOnBoard = members.some(m => m.id === user.id);

    return (
        <div className="space-y-6 animate-slide-in-up">
            <Card className="!bg-transparent !p-0 !border-0">
                <div className="flex items-center gap-3 mb-2">
                    <Award className="h-8 w-8 text-brand-primary" />
                    <div>
                        <h2 className="text-3xl font-bold text-white">Совет Директоров</h2>
                        <p className="text-gray-400">Элитный клуб лидеров, определяющих будущее Nexus Capital.</p>
                    </div>
                </div>
            </Card>
            
            {!isUserOnBoard && (
                <Card className="!bg-red-900/50 border border-red-500/50 text-center">
                    <Info className="w-8 h-8 mx-auto text-red-400 mb-2"/>
                    <h3 className="font-bold text-white">Доступ ограничен</h3>
                    <p className="text-red-300">Этот раздел доступен только для Партнеров из топ-10 глобального рейтинга.</p>
                </Card>
            )}

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${!isUserOnBoard ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="lg:col-span-1 space-y-6">
                    <Card className="!bg-gradient-to-br from-dark-800 to-dark-700 text-center">
                        <DollarSign className="w-10 h-10 text-accent-gold mx-auto mb-2 animate-pulse"/>
                        <h3 className="text-lg font-semibold text-gray-300">Глобальный Бонусный Пул</h3>
                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-accent-gold my-2">{`$${Number(globalBonusPool || 0).toLocaleString('ru-RU')}`}</p>
                        <p className="text-xs text-gray-500">Распределяется между членами Совета ежемесячно</p>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BarChart className="w-5 h-5"/>Статистика</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Членов Совета:</span><span className="font-bold text-white">10</span></div>
                            <div className="flex justify-between"><span>Общий доход:</span><span className="font-bold text-white">$450,830</span></div>
                            <div className="flex justify-between"><span>Активных голосований:</span><span className="font-bold text-white">1</span></div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users className="w-6 h-6"/>Члены Совета</h3>
                        <div className="space-y-2">
                            {members.map(member => <MemberRow key={member.id} member={member} isCurrentUser={member.id === user.id} />)}
                        </div>
                    </Card>
                </div>
            </div>
            
             {isUserOnBoard && activeVote && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Активное голосование</h2>
                    <VoteCard vote={activeVote} />
                </div>
            )}
        </div>
    );
};

export default TheBoardroomView;