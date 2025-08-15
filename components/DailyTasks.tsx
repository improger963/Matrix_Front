import React from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import type { DailyTask } from '../types.ts';
import { Check, Gift, Zap, ArrowRight } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';

interface DailyTasksProps {
    tasks: DailyTask[];
    onTaskAction: (task: DailyTask) => void;
}

const DailyTasks: React.FC<DailyTasksProps> = ({ tasks, onTaskAction }) => {
    const { setActiveView } = useAppContext();
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-brand-accent" />
                    <h3 className="text-xl font-bold text-white">Сегодняшние задания</h3>
                </div>
                <span className="text-sm font-bold text-brand-accent">{completedTasks}/{tasks.length}</span>
            </div>
            
             <div className="w-full bg-dark-700 rounded-full h-1.5 mb-4">
                <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <div className="space-y-3 mb-4">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className={`p-3 rounded-lg flex items-center gap-3 transition-all ${task.isCompleted ? 'bg-dark-700/50 opacity-60' : 'bg-dark-700'}`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${task.isCompleted ? 'bg-green-500/20' : 'bg-dark-800'}`}>
                             <task.icon className={`h-5 w-5 ${task.isCompleted ? 'text-green-400' : 'text-brand-accent'}`} />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{task.title}</p>
                            <p className="text-xs text-gray-400">{task.description}</p>
                        </div>
                        <div className="text-right">
                           {task.isCompleted ? (
                                <div className="flex items-center justify-center gap-1.5 text-green-400 font-semibold text-sm w-32">
                                    <Check className="h-4 w-4" />
                                    <span>Готово</span>
                                </div>
                           ) : (
                                <Button
                                    variant="secondary"
                                    className="!text-xs !px-2 !py-1"
                                    onClick={() => onTaskAction(task)}
                                >
                                    {task.actionText}
                                </Button>
                           )}
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setActiveView('tasks')}>
                Перейти ко всем заданиям
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </Card>
    );
};

export default DailyTasks;