
import React from 'react';
import type { Notification } from '../types.ts';
import { CheckCheck } from 'lucide-react';

interface NotificationsPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAllRead: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onMarkAllRead }) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div
            className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl animate-fade-in z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
        >
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
                <h3 id="notifications-title" className="font-bold text-white">Уведомления</h3>
                {unreadCount > 0 && (
                    <button onClick={onMarkAllRead} className="text-xs text-brand-accent hover:text-white flex items-center gap-1.5">
                        <CheckCheck className="h-4 w-4" />
                        Отметить все как прочитанные
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 flex items-start gap-4 transition-colors hover:bg-dark-700/50 ${!notif.isRead ? 'bg-brand-primary/10' : ''}`}>
                            <div className="mt-1 relative">
                                <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                                    <notif.icon className="w-5 h-5 text-brand-accent" />
                                </div>
                                {!notif.isRead && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-dark-800" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-white text-sm">{notif.title}</p>
                                <p className="text-xs text-gray-400">{notif.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>У вас нет новых уведомлений.</p>
                    </div>
                )}
            </div>
            <div className="p-2 bg-dark-900/50 text-center rounded-b-xl">
                <button onClick={onClose} className="text-sm font-semibold text-brand-accent hover:text-white w-full py-1">
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default NotificationsPanel;
