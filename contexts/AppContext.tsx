


import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Partner, DailyTask, View, Toast, AcademyArticle, Project } from '../types.ts';
import { MOCK_PARTNER, MOCK_ALL_TASKS, MOCK_ACADEMY_ARTICLES, MOCK_PORTFOLIO } from '../constants.ts';
import ToastContainer from '../components/ui/ToastContainer.tsx';

interface AppContextType {
    user: Partner;
    setUser: React.Dispatch<React.SetStateAction<Partner>>;
    tasks: DailyTask[];
    handleCompleteTask: (taskId: string, showToast?: boolean) => void;
    handleTaskAction: (task: DailyTask) => void;
    academyArticles: AcademyArticle[];
    completeAcademyArticle: (articleId: string) => void;
    activeView: View;
    setActiveView: (view: View, options?: { subView?: string }) => void;
    subView: string | null;
    toasts: Toast[];
    addToast: (message: string, type?: Toast['type']) => void;
    portfolio: Project[];
    activateFirstProject: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Partner>(MOCK_PARTNER);
    const [tasks, setTasks] = useState<DailyTask[]>(MOCK_ALL_TASKS);
    const [academyArticles, setAcademyArticles] = useState<AcademyArticle[]>(MOCK_ACADEMY_ARTICLES);
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [subView, setSubView] = useState<string | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [portfolio, setPortfolio] = useState<Project[]>([]);

    const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = new Date().getTime().toString();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    const handleSetActiveView = useCallback((view: View, options?: { subView?: string }) => {
        setActiveView(view);
        setSubView(options?.subView || null);
    }, []);

    const activateFirstProject = useCallback(() => {
        setPortfolio([MOCK_PORTFOLIO[0]]);
        addToast('Проект "Pre-seed" успешно запущен! Пора продавать Доли.', 'success');
    }, [addToast]);

    const handleCompleteTask = useCallback((taskId: string, showToast: boolean = true) => {
        let taskTitle = '';
        let taskRewardXP = 0;
        let taskRewardCAP = 0;
        setTasks(prevTasks =>
            prevTasks.map(task => {
                if (task.id === taskId && !task.isCompleted) {
                    taskTitle = task.title;
                    taskRewardXP = task.reward;
                    taskRewardCAP = task.rewardCAP || 0;
                    return { ...task, isCompleted: true };
                }
                return task;
            })
        );
        if (taskTitle) {
            setUser(prevUser => ({ ...prevUser, xp: prevUser.xp + taskRewardXP, capital: prevUser.capital + taskRewardCAP }));
            if (showToast) {
                 let rewardString = `+${taskRewardXP} XP`;
                 if (taskRewardCAP > 0) {
                     rewardString += `, +$${taskRewardCAP} CAP`;
                 }
                 addToast(`Миссия "${taskTitle}" выполнена! ${rewardString}`, 'success');
            }
        }
    }, [addToast]);
    
    const completeAcademyArticle = useCallback((articleId: string) => {
        let articleTitle = '';
        let articleReward = 0;
        setAcademyArticles(prevArticles => 
            prevArticles.map(article => {
                if(article.id === articleId && !article.isCompleted) {
                    articleTitle = article.title;
                    articleReward = article.xpReward;
                    return { ...article, isCompleted: true };
                }
                return article;
            })
        );
        if (articleTitle) {
            setUser(prevUser => ({ ...prevUser, xp: prevUser.xp + articleReward }));
            addToast(`Урок "${articleTitle}" пройден! +${articleReward} XP`, 'success');
        }
    }, [addToast]);

    const handleTaskAction = useCallback((task: DailyTask) => {
        switch (task.actionType) {
            case 'navigate':
                if (task.target && typeof task.target === 'string' && !task.target.startsWith('http')) {
                    handleSetActiveView(task.target as View);
                }
                break;
            case 'copy':
                navigator.clipboard.writeText(user.referralLink);
                addToast('Реферальная ссылка скопирована!', 'success');
                handleCompleteTask(task.id);
                break;
            case 'external_link':
                 if (task.target) {
                    window.open(task.target, '_blank');
                    handleCompleteTask(task.id);
                 }
                break;
            default:
                break;
        }
    }, [user.referralLink, handleCompleteTask, addToast, handleSetActiveView]);

    const value = {
        user,
        setUser,
        tasks,
        handleCompleteTask,
        handleTaskAction,
        academyArticles,
        completeAcademyArticle,
        activeView,
        setActiveView: handleSetActiveView,
        subView,
        toasts,
        addToast,
        portfolio,
        activateFirstProject: activateFirstProject,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};