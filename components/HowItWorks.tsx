import React from 'react';
import Card from './ui/Card';
import { Rocket, Users, Gift, TrendingUp } from 'lucide-react';

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
                <h2 className="text-3xl font-bold text-white text-center mb-2">Как работает MatrixFlow?</h2>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10">
                    Наша система построена на простой и прозрачной матричной модели, которая позволяет каждому участнику зарабатывать, строя свою команду.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StepCard 
                        icon={<Rocket className="h-6 w-6 text-white"/>}
                        title="Шаг 1: Активация"
                        description="Присоединяйтесь к проекту, активировав свое место в первой матрице. Это ваш билет к неограниченным возможностям."
                    />
                     <StepCard 
                        icon={<Users className="h-6 w-6 text-white"/>}
                        title="Шаг 2: Приглашение"
                        description="Пригласите двух новых участников, используя свою реферальную ссылку. Они займут места под вами в вашей матрице."
                    />
                     <StepCard 
                        icon={<Gift className="h-6 w-6 text-white"/>}
                        title="Шаг 3: Вознаграждение"
                        description="Как только ваша матрица заполнится, вы получаете вознаграждение и автоматически переходите на следующий, более прибыльный уровень."
                    />
                    <StepCard 
                        icon={<TrendingUp className="h-6 w-6 text-white"/>}
                        title="Шаг 4: Масштабирование"
                        description="Продолжайте развивать свою команду, открывая новые уровни и получая 'клонов', которые ускоряют ваш доход."
                    />
                </div>
            </Card>
        </div>
    );
};

export default HowItWorks;