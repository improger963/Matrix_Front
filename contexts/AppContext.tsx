import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { User, DailyTask, View, Toast, AcademyArticle } from '../types.ts';
import { MOCK_USER, MOCK_ALL_TASKS, MOCK_ACADEMY_ARTICLES } from '../constants.ts';
import ToastContainer from '../components/ui/ToastContainer.tsx';

interface AppContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    tasks: DailyTask[];
    handleCompleteTask: (taskId: string, showToast?: boolean) => void;
    handleTaskAction: (task: DailyTask) => void;
    academyArticles: AcademyArticle[];
    completeAcademyArticle: (articleId: string) => void;
    activeView: View;
    setActiveView: (view: View) => void;
    toasts: Toast[];
    addToast: (message: string, type?: Toast['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(MOCK_USER);
    const [tasks, setTasks] = useState<DailyTask[]>(MOCK_ALL_TASKS);
    const [academyArticles, setAcademyArticles] = useState<AcademyArticle[]>(MOCK_ACADEMY_ARTICLES);
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = new Date().getTime().toString();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    const handleCompleteTask = useCallback((taskId: string, showToast: boolean = true) => {
        let taskTitle = '';
        let taskReward = 0;
        setTasks(prevTasks =>
            prevTasks.map(task => {
                if (task.id === taskId && !task.isCompleted) {
                    taskTitle = task.title;
                    taskReward = task.reward;
                    return { ...task, isCompleted: true };
                }
                return task;
            })
        );
        if (taskTitle) {
            setUser(prevUser => ({ ...prevUser, xp: prevUser.xp + taskReward }));
            if (showToast) {
                 addToast(`Задание "${taskTitle}" выполнено! +${taskReward} XP`, 'success');
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
                    setActiveView(task.target as View);
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
    }, [user.referralLink, handleCompleteTask, addToast]);

    const value = {
        user,
        setUser,
        tasks,
        handleCompleteTask,
        handleTaskAction,
        academyArticles,
        completeAcademyArticle,
        activeView,
        setActiveView,
        toasts,
        addToast
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