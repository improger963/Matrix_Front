
import React from 'react';
import Card from './ui/Card.tsx';
import { Rocket, Users, Gift, TrendingUp, Building } from 'lucide-react';

const StepCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <Card className="!bg-dark-700/50 text-center hover:!bg-dark-700 hover:-translate-y-1 transition-all duration-300">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </Card>
);


const HowItWorks: React.FC = () => {
    return (
        <div className="space-y-6 animate-slide-in-up">
            <Card>
                <h2 className="text-3xl font-bold text-white text-center mb-2">Как работает "Nexus Capital"?</h2>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10">
                    Наша игровая механика основана на простой и прозрачной бизнес-модели, которая позволяет каждому Партнеру зарабатывать, строя свою финансовую империю.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StepCard 
                        icon={<Rocket className="h-6 w-6 text-white"/>}
                        title="Шаг 1: Запуск Проекта"
                        description="Начните с запуска своего первого Проекта. Это ваш билет в мир венчурных инвестиций."
                    />
                     <StepCard 
                        icon={<Users className="h-6 w-6 text-white"/>}
                        title="Шаг 2: Формирование Бизнес-сети"
                        description="Продайте Доли в своем Проекте, пригласив партнеров в свою Бизнес-сеть."
                    />
                     <StepCard 
                        icon={<Gift className="h-6 w-6 text-white"/>}
                        title="Шаг 3: Полное Финансирование"
                        description="Как только все Доли проданы, Проект получает Полное Финансирование, и вы получаете Прибыль."
                    />
                    <StepCard 
                        icon={<Building className="h-6 w-6 text-white"/>}
                        title="Шаг 4: Масштабирование"
                        description="Инвестируйте в более дорогие Проекты ('Series A', 'IPO') для экспоненциального роста вашего Капитала."
                    />
                </div>
            </Card>
        </div>
    );
};

export default HowItWorks;
