import React, { useMemo } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import type { DailyTask } from '../types.ts';
import { ListChecks, Check, Trophy } from 'lucide-react';

const TaskItem: React.FC<{ task: DailyTask, onAction: (task: DailyTask) => void }> = ({ task, onAction }) => {
    const progressPercentage = task.progress ? (task.progress.current / task.progress.target) * 100 : 0;
    return (
        <Card className={`!p-4 transition-all duration-300 ${task.isCompleted ? 'bg-dark-800/60 opacity-70' : 'bg-dark-800 hover:bg-dark-700'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${task.isCompleted ? 'bg-green-500/20' : 'bg-dark-900'}`}>
                    <task.icon className={`h-8 w-8 ${task.isCompleted ? 'text-green-400' : 'text-brand-accent'}`} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white">{task.title}</h4>
                         <div className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full whitespace-nowrap">
                            {task.reward}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    {task.progress && !task.isCompleted && (
                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Прогресс</span>
                                <span>{task.progress.current}/{task.progress.target}</span>
                            </div>
                            <div className="w-full bg-dark-900 rounded-full h-1.5">
                                <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full sm:w-auto flex-shrink-0">
                    {task.isCompleted ? (
                         <div className="flex items-center justify-center gap-2 text-green-400 font-semibold p-2 rounded-lg bg-green-500/10 w-full sm:w-36">
                            <Check className="h-5 w-5" />
                            <span>Выполнено</span>
                        </div>
                    ) : (
                        <Button
                            onClick={() => onAction(task)}
                            className="w-full sm:w-36"
                            variant={task.category === 'special' ? 'primary' : 'secondary'}
                        >
                            {task.actionText}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

const TasksView: React.FC = () => {
    const { tasks, handleTaskAction } = useAppContext();

    const completedTasksCount = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);
    const totalTasksCount = tasks.length;
    const overallProgress = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

    const categorizedTasks = useMemo(() => {
        const categories: { [key in DailyTask['category']]: DailyTask[] } = {
            onboarding: [],
            daily: [],
            special: [],
        };
        tasks.forEach(task => {
            if (categories[task.category]) {
                categories[task.category].push(task);
            }
        });
        return categories;
    }, [tasks]);

    const categoryTitles: { [key in DailyTask['category']]: string } = {
        onboarding: 'Задания для новичков',
        daily: 'Ежедневные задания',
        special: 'Специальные задания'
    };
    
    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <ListChecks className="h-8 w-8 text-brand-primary" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Центр Заданий</h2>
                            <p className="text-gray-400">Выполняйте задания, получайте награды и ускоряйте свой прогресс.</p>
                        </div>
                    </div>
                </div>
                 <div className="mt-6">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-300">Общий прогресс</p>
                        <p className="text-sm font-bold text-brand-accent">{completedTasksCount} / {totalTasksCount} заданий</p>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-brand-secondary to-brand-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                    </div>
                </div>
            </Card>

            {Object.entries(categorizedTasks).map(([category, tasksInCategory]) => {
                if (tasksInCategory.length === 0) return null;
                return (
                    <div key={category}>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                             <Trophy className="h-5 w-5 text-brand-accent"/>
                             {categoryTitles[category as DailyTask['category']]}
                        </h3>
                        <div className="space-y-4">
                            {tasksInCategory
                                .sort((a, b) => (a.isCompleted ? 1 : -1) - (b.isCompleted ? 1 : -1) || 0) // sort completed to bottom
                                .map(task => (
                                    <TaskItem key={task.id} task={task} onAction={handleTaskAction} />
                            ))}
                        </div>
                    </div>
                );
            })}

        </div>
    );
};

export default TasksView;
