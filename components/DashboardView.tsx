
import React from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { MOCK_EARNINGS_7_DAYS, MOCK_MARKET_STATS, MOCK_LIVE_FEED_EVENTS } from '../constants.ts';
import { AnimatedBalance } from './ui/Stat.tsx';
import { ArrowRight, Briefcase, TrendingUp, Activity, PieChart, Target } from 'lucide-react';

const WelcomeBanner: React.FC<{ user: any; setActiveView: (view: any) => void }> = ({ user, setActiveView }) => (
    <Card className="animate-slide-in-up !bg-gradient-to-br !from-dark-800 !to-dark-700 border-dark-600 lg:col-span-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Добро пожаловать, Партнер {user.name.split(' ')[0]}!</h2>
                <p className="text-gray-400 mt-1">Ваш центр управления инвестициями. Рынок ждет!</p>
            </div>
            <Button onClick={() => setActiveView('tasks')} className="animate-glow">
                <Target className="w-5 h-5 mr-2" />
                <span>Перейти к заданиям</span>
            </Button>
        </div>
    </Card>
);

const CapitalOverview: React.FC<{ user: any, data: any[] }> = ({ user, data }) => {
    const totalEarnings = data.reduce((sum, d) => sum + d.earnings, 0);

    return (
        <Card className="lg:col-span-2 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-6 h-6 text-brand-primary" /> Обзор Капитала</h3>
                <span className="text-sm font-bold text-accent-green">+{totalEarnings.toLocaleString('ru-RU')} CAP (7д)</span>
            </div>
            <div className="my-6">
                <p className="text-sm text-gray-400">Текущий баланс</p>
                <div className="text-5xl font-bold text-white">
                    <AnimatedBalance value={user.capital} />
                </div>
            </div>
            {/* Simple placeholder for chart */}
            <div className="w-full h-20 bg-dark-700/50 rounded-lg flex items-end p-2">
                 <div className="h-full w-full bg-gradient-to-t from-brand-primary/50 to-transparent"></div>
            </div>
        </Card>
    );
};

const PortfolioWidget: React.FC<{ user: any, setActiveView: (view: any) => void }> = ({ user, setActiveView }) => {
    return (
        <Card className="lg:col-span-2 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Briefcase className="w-6 h-6 text-brand-primary" /> Портфель Стартапов</h3>
            <div className="space-y-3">
                {/* Example startups */}
                <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                    <div>
                        <p className="font-semibold text-white">Fintech Innovators</p>
                        <p className="text-xs text-gray-400">Раунд А</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-accent-green">+15.7%</p>
                        <p className="text-xs text-gray-500">Заполнено: 5/6</p>
                    </div>
                </div>
                 <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                    <div>
                        <p className="font-semibold text-white">GreenTech Solutions</p>
                        <p className="text-xs text-gray-400">Pre-seed</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-accent-green">+5.2%</p>
                        <p className="text-xs text-gray-500">Заполнено: 2/6</p>
                    </div>
                </div>
            </div>
             <Button onClick={() => setActiveView('startup')} variant="secondary" className="w-full mt-4">
                Управлять портфелем <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Card>
    );
};

const SyndicateActivity: React.FC<{ events: any[] }> = ({ events }) => {
     const syndicateEvents = events.filter(e => e.type === 'startup_exit' || e.type === 'new_level').slice(0, 4);

    return (
        <Card className="lg:col-span-2 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-6 h-6 text-brand-primary" /> Активность Синдиката</h3>
            <div className="space-y-3">
                {syndicateEvents.map(event => (
                    <div key={event.id} className="flex items-center gap-3 text-sm">
                        <img src={event.user.avatarUrl} alt={event.user.name} className="w-8 h-8 rounded-full" />
                        <p className="text-gray-300">
                           <span className="font-semibold text-white">{event.user.name}</span>
                           {event.type === 'startup_exit' ? ' закрыл раунд с прибылью ' : ' достиг уровня '}
                           <span className="font-bold text-brand-accent">{event.type === 'startup_exit' ? `$${event.amount}` : event.level}</span>
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const MarketplaceWidget: React.FC<{ setActiveView: (view: any) => void }> = ({ setActiveView }) => {
    return (
        <Card className="lg:col-span-2 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><PieChart className="w-6 h-6 text-brand-primary" /> Рынок Стартапов</h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                    <div>
                        <p className="font-semibold text-white">AI & ML</p>
                        <p className="text-xs text-gray-400">Высокая доходность, высокий риск</p>
                    </div>
                    <Button variant="secondary" className="!px-3 !py-1 !text-xs">Смотреть</Button>
                </div>
                 <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                    <div>
                        <p className="font-semibold text-white">GreenTech</p>
                        <p className="text-xs text-gray-400">Стабильный рост, средний риск</p>
                    </div>
                    <Button variant="secondary" className="!px-3 !py-1 !text-xs">Смотреть</Button>
                </div>
             </div>
             <Button onClick={() => setActiveView('market')} variant="secondary" className="w-full mt-4">
                Перейти на рынок <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Card>
    )
}

const DashboardView: React.FC = () => {
    const { user, setActiveView } = useAppContext();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <WelcomeBanner user={user} setActiveView={setActiveView} />
            <CapitalOverview user={user} data={MOCK_EARNINGS_7_DAYS} />
            <PortfolioWidget user={user} setActiveView={setActiveView} />
            <SyndicateActivity events={MOCK_LIVE_FEED_EVENTS} />
            <MarketplaceWidget setActiveView={setActiveView} />
        </div>
    );
};

export default DashboardView;
