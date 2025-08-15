

import React, { useMemo, useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import type { Mission } from '../types.ts';
import { ListChecks, Check, Trophy, Zap, Gift } from 'lucide-react';

const TaskCard: React.FC<{ task: Mission, onAction: (task: Mission) => void }> = ({ task, onAction }) => {
    const isCompleted = task.status === 'completed' || task.status === 'claimed';
    const progressPercentage = task.progress ? (task.progress.current / task.progress.target) * 100 : 0;

    const categoryStyles = {
        onboarding: {
            bg: 'from-brand-primary/20 to-dark-800/10',
            border: 'border-brand-primary/50',
            iconBg: 'bg-brand-primary/20',
            iconColor: 'text-brand-primary',
            buttonVariant: 'secondary' as 'secondary'
        },
        daily: {
            bg: 'from-accent-cyan/20 to-dark-800/10',
            border: 'border-accent-cyan/50',
            iconBg: 'bg-accent-cyan/20',
            iconColor: 'text-accent-cyan',
            buttonVariant: 'secondary' as 'secondary'
        },
        special: {
            bg: 'from-accent-gold/20 to-dark-800/10',
            border: 'border-accent-gold/50 animate-card-glow',
            iconBg: 'bg-accent-gold/20',
            iconColor: 'text-accent-gold',
            buttonVariant: 'primary' as 'primary'
        },
        mission: {
             bg: 'from-purple-500/20 to-dark-800/10',
            border: 'border-purple-500/50',
            iconBg: 'bg-purple-500/20',
            iconColor: 'text-purple-400',
            buttonVariant: 'secondary' as 'secondary'
        }
    };
    
    const getCategoryStyleKey = (category: Mission['category']): keyof typeof categoryStyles => {
        switch(category) {
            case 'Путь Партнера': return 'onboarding';
            case 'Ежедневные Брифинги': return 'daily';
            case 'Еженедельные Контракты': return 'special';
            default: return 'mission';
        }
    }

    const styles = categoryStyles[getCategoryStyleKey(task.category)];

    return (
        <div className={`
            relative rounded-xl border p-5 transition-all duration-300 overflow-hidden
            bg-gradient-to-br ${styles.bg} ${styles.border}
            ${isCompleted ? 'opacity-50 saturate-50' : 'hover:border-brand-accent/70 hover:shadow-2xl hover:shadow-brand-primary/20 hover:-translate-y-1'}
        `}>
            <div className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${styles.iconBg}`}>
                        <task.icon className={`h-6 w-6 ${styles.iconColor}`} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white mt-1">{task.title}</h4>
                        <p className="text-sm text-gray-400 mt-1 text-balance" dangerouslySetInnerHTML={{ __html: task.description }}></p>
                    </div>
                </div>
                
                {task.progress && !isCompleted && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Прогресс</span>
                            <span>{task.progress.current}/{task.progress.target}</span>
                        </div>
                        <div className="w-full bg-dark-900 rounded-full h-1.5">
                            <div className="bg-brand-primary h-1.5 rounded-full animate-progress-fill" style={{ width: `${progressPercentage}%`, animationDelay: '0.5s' }}></div>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-300 flex items-center gap-1.5">
                       <Zap className="w-4 h-4" /> +{task.rewardRP} RP
                    </div>
                    <div>
                        {isCompleted ? (
                            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold p-2 rounded-lg bg-green-500/10 w-full sm:w-36 animate-check-in">
                                <Check className="h-5 w-5" />
                                <span>Выполнено</span>
                            </div>
                        ) : (
                            <Button
                                onClick={() => onAction(task)}
                                className="w-full sm:w-36"
                                variant={styles.buttonVariant}
                            >
                                {task.actionText}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const WeeklyPrizeCard: React.FC = () => {
    const weeklyTasksCompleted = 5;
    const weeklyTasksTotal = 7;
    const progress = (weeklyTasksCompleted / weeklyTasksTotal) * 100;
  
    return (
      <Card className="lg:col-span-1 !bg-gradient-to-br from-dark-800 to-dark-700">
        <div className="flex items-center gap-3">
          <Gift className="w-8 h-8 text-accent-gold" />
          <div>
            <h3 className="text-xl font-bold text-white">Главный приз недели</h3>
            <p className="text-sm text-gray-400">Выполняйте миссии и забирайте награду!</p>
          </div>
        </div>
        <div className="text-center my-6">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400 animate-text-glow">$50</p>
          <p className="text-sm text-gray-400">на ваш баланс</p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-300">Прогресс</p>
            <p className="text-sm font-bold text-accent-gold">{weeklyTasksCompleted} / {weeklyTasksTotal} миссий</p>
          </div>
          <div className="w-full bg-dark-900 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-yellow-500 to-accent-gold h-2.5 rounded-full animate-progress-fill" style={{ width: `${progress}%`, animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </Card>
    );
  };


const TasksView: React.FC = () => {
    const { missions, handleMissionAction } = useAppContext();

    const categorizedTasks = useMemo(() => {
        const categories: { [key in Mission['category']]?: Mission[] } = {};
        missions.forEach(task => {
            if (!categories[task.category]) {
                categories[task.category] = [];
            }
            categories[task.category]!.push(task);
        });
        return categories;
    }, [missions]);

    const categoryOrder: Mission['category'][] = ['Путь Партнера', 'Ежедневные Брифинги', 'Еженедельные Контракты'];

    const categoryTitles: { [key in Mission['category']]: string } = {
        'Путь Партнера': '🚀 Путь новичка',
        'Ежедневные Брифинги': 'Ежедневные ритуалы',
        'Еженедельные Контракты': '💎 Особые контракты',
    };
    
    return (
        <div className="space-y-8">
            <Card className="!bg-transparent !p-0 !border-0">
                <div className="flex items-center gap-3 mb-2">
                    <ListChecks className="h-8 w-8 text-brand-primary" />
                    <div>
                        <h2 className="text-3xl font-bold text-white">Центр Миссий</h2>
                        <p className="text-gray-400">Выполняйте задания, получайте XP и ускоряйте свой прогресс.</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <WeeklyPrizeCard />

                 <div className="lg:col-span-2">
                     <Card>
                         <h3 className="text-xl font-bold text-white mb-4">{categoryTitles['Путь Партнера']}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {(categorizedTasks['Путь Партнера'] || []).map(task => (
                                 <TaskCard key={task.id} task={task} onAction={handleMissionAction} />
                             ))}
                         </div>
                     </Card>
                 </div>
            </div>

            {categoryOrder.map(category => {
                const tasksInCategory = categorizedTasks[category] || [];
                if (category === 'Путь Партнера' || tasksInCategory.length === 0) return null;
                return (
                    <div key={category}>
                        <h3 className="text-2xl font-bold text-white mb-4 ml-2">
                             {categoryTitles[category as Mission['category']]}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasksInCategory
                                .sort((a, b) => ((a.status === 'completed' || a.status === 'claimed') ? 1 : -1) - ((b.status === 'completed' || b.status === 'claimed') ? 1 : -1) || 0)
                                .map(task => (
                                    <TaskCard key={task.id} task={task} onAction={handleMissionAction} />
                            ))}
                        </div>
                    </div>
                );
            })}

        </div>
    );
};

export default TasksView;
