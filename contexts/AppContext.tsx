import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { User, DailyTask, View, Toast } from '../types.ts';
import { MOCK_USER, MOCK_DAILY_TASKS } from '../constants.ts';
import ToastContainer from '../components/ui/ToastContainer.tsx';

interface AppContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    dailyTasks: DailyTask[];
    handleCompleteTask: (taskId: string, showToast?: boolean) => void;
    handleTaskAction: (task: DailyTask) => void;
    activeView: View;
    setActiveView: (view: View) => void;
    toasts: Toast[];
    addToast: (message: string, type?: Toast['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(MOCK_USER);
    const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(MOCK_DAILY_TASKS);
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
        setDailyTasks(prevTasks =>
            prevTasks.map(task => {
                if (task.id === taskId && !task.isCompleted) {
                    taskTitle = task.title;
                    return { ...task, isCompleted: true };
                }
                return task;
            })
        );
        if (taskTitle && showToast) {
            addToast(`Задание "${taskTitle}" выполнено!`, 'success');
        }
    }, [addToast]);

    const handleTaskAction = useCallback((task: DailyTask) => {
        switch (task.actionType) {
            case 'navigate':
                if (task.targetView) {
                    setActiveView(task.targetView);
                }
                break;
            case 'copy':
                navigator.clipboard.writeText(user.referralLink);
                addToast('Реферальная ссылка скопирована!', 'success');
                handleCompleteTask(task.id);
                break;
            default:
                break;
        }
    }, [user.referralLink, handleCompleteTask, addToast]);

    const value = {
        user,
        setUser,
        dailyTasks,
        handleCompleteTask,
        handleTaskAction,
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
