
import React from 'react';
import Card from './ui/Card.tsx';
import type { LiveFeedEvent } from '../types.ts';
import { MOCK_LIVE_FEED_EVENTS } from '../constants.ts';
import { Zap, UserPlus, ChevronsUp, ArrowDownCircle, ArrowUpCircle, ShieldCheck } from 'lucide-react';

const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " г. назад";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " мес. назад";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " д. назад";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " ч. назад";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " мин. назад";
    if (seconds < 10) return "только что";
    return Math.floor(seconds) + " сек. назад";
};

const EventIcon: React.FC<{ type: LiveFeedEvent['type'] }> = ({ type }) => {
    const iconMap = {
        registration: <UserPlus className="h-5 w-5 text-blue-400" />,
        new_level: <ChevronsUp className="h-5 w-5 text-yellow-400" />,
        withdrawal: <ArrowDownCircle className="h-5 w-5 text-red-400" />,
        deposit: <ArrowUpCircle className="h-5 w-5 text-green-400" />,
        project_close: <ShieldCheck className="h-5 w-5 text-purple-400" />,
    };
    return <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center flex-shrink-0">{iconMap[type]}</div>;
};

const EventMessage: React.FC<{ event: LiveFeedEvent }> = ({ event }) => {
    const { type, user, amount, level } = event;
    const userName = <span className="font-semibold text-white">{user.name}</span>;

    switch (type) {
        case 'registration': return <>{userName} только что присоединился к проекту.</>;
        case 'new_level': return <>{userName} достиг(ла) {level} уровня!</>;
        case 'withdrawal': return <>{userName} вывел(а) <span className="font-semibold text-red-400">${amount?.toFixed(2)}</span>.</>;
        case 'deposit': return <>{userName} пополнил(а) баланс на <span className="font-semibold text-green-400">${amount?.toFixed(2)}</span>.</>;
        case 'project_close': return <>{userName} закрыл(а) проект и получил(а) <span className="font-semibold text-purple-400">©{amount?.toFixed(2)}</span>.</>;
        default: return null;
    }
};

interface LiveFeedProps {
    fullPage?: boolean;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ fullPage = false }) => {
    const events = MOCK_LIVE_FEED_EVENTS;

    return (
        <Card>
            <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-brand-accent" />
                <div>
                    <h3 className="text-xl font-bold text-white">Живая лента</h3>
                    {fullPage && <p className="text-gray-400 text-sm">Все события проекта в реальном времени</p>}
                </div>
            </div>
            <div className={`${fullPage ? 'max-h-[calc(100vh-280px)]' : 'max-h-[420px]'} overflow-y-auto pr-2 space-y-4`}>
                {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 animate-fade-in">
                        <EventIcon type={event.type} />
                        <div className="flex-1 text-sm">
                            <p className="text-gray-300">
                                <EventMessage event={event} />
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(event.timestamp)}</p>
                        </div>
                         <img src={event.user.avatarUrl} alt={event.user.name} className="h-10 w-10 rounded-full flex-shrink-0 border-2 border-dark-600" />
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default LiveFeed;
