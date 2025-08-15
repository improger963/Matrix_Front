

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Partner, View, Toast, AcademyArticle, Project, Mission } from '../types.ts';
import { MOCK_PARTNER, MOCK_MISSIONS, MOCK_ACADEMY_ARTICLES, MOCK_PROJECTS } from '../constants.ts';
import ToastContainer from '../components/ui/ToastContainer.tsx';

interface AppContextType {
    user: Partner;
    setUser: React.Dispatch<React.SetStateAction<Partner>>;
    missions: Mission[];
    handleCompleteMission: (missionId: string, showToast?: boolean) => void;
    handleMissionAction: (mission: Mission) => void;
    academyArticles: AcademyArticle[];
    completeAcademyArticle: (articleId: string) => void;
    activeView: View;
    setActiveView: (view: View, options?: { subView?: string }) => void;
    subView: string | null;
    toasts: Toast[];
    addToast: (message: string, type?: Toast['type']) => void;
    portfolio: Project[];
    activateFirstProject: () => void;
    RankUpModal: () => React.ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Partner>(MOCK_PARTNER);
    const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);
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
        setPortfolio([MOCK_PROJECTS[0]]);
        addToast('Проект "Pre-seed" успешно запущен! Пора продавать Доли.', 'success');
    }, [addToast]);

    const handleCompleteMission = useCallback((missionId: string, showToast: boolean = true) => {
        let missionTitle = '';
        let missionRewardRP = 0;
        let missionRewardCAP = 0;
        setMissions(prevMissions =>
            prevMissions.map(mission => {
                if (mission.id === missionId && mission.status !== 'completed' && mission.status !== 'claimed') {
                    missionTitle = mission.title;
                    missionRewardRP = mission.rewardRP;
                    missionRewardCAP = mission.rewardCAP || 0;
                    return { ...mission, status: 'completed' };
                }
                return mission;
            })
        );
        if (missionTitle) {
            setUser(prevUser => ({ ...prevUser, reputation: prevUser.reputation + missionRewardRP, capital: prevUser.capital + missionRewardCAP }));
            if (showToast) {
                 let rewardString = `+${missionRewardRP} RP`;
                 if (missionRewardCAP > 0) {
                     rewardString += `, +$${missionRewardCAP} CAP`;
                 }
                 addToast(`Миссия "${missionTitle}" выполнена! ${rewardString}`, 'success');
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
                    articleReward = article.rewardRP;
                    return { ...article, isCompleted: true };
                }
                return article;
            })
        );
        if (articleTitle) {
            setUser(prevUser => ({ ...prevUser, reputation: prevUser.reputation + articleReward }));
            addToast(`Урок "${articleTitle}" пройден! +${articleReward} RP`, 'success');
        }
    }, [addToast]);

    const handleMissionAction = useCallback((mission: Mission) => {
        switch (mission.actionType) {
            case 'navigate':
                if (mission.target && typeof mission.target === 'string' && !mission.target.startsWith('http')) {
                    handleSetActiveView(mission.target as View);
                }
                break;
            case 'copy':
                navigator.clipboard.writeText(user.referralLink);
                addToast('Реферальная ссылка скопирована!', 'success');
                handleCompleteMission(mission.id);
                break;
            case 'external_link':
                 if (mission.target) {
                    window.open(mission.target, '_blank');
                    handleCompleteMission(mission.id);
                 }
                break;
            default:
                break;
        }
    }, [user.referralLink, handleCompleteMission, addToast, handleSetActiveView]);

    const RankUpModal = () => null; // Mock implementation to avoid crash

    const value = {
        user,
        setUser,
        missions,
        handleCompleteMission,
        handleMissionAction,
        academyArticles,
        completeAcademyArticle,
        activeView,
        setActiveView: handleSetActiveView,
        subView,
        toasts,
        addToast,
        portfolio,
        activateFirstProject,
        RankUpModal,
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
