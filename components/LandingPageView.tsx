import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_LEADERS, MOCK_MARKET_STATS } from '../constants.ts';
import { ChevronLeft, ChevronRight, BrainCircuit, BarChart3, Users, Rocket, TrendingUp, Gift, Award, Briefcase, Zap, ShieldCheck, PlayCircle, Bot } from 'lucide-react';
import Button from './ui/Button.tsx';
import Card from './ui/Card.tsx';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// --- HOOKS ---
const useIntersectionObserver = (options?: IntersectionObserverInit) => {
    const [node, setNode] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (node) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            }, options);
            observer.observe(node);
            return () => observer.disconnect();
        }
    }, [node, options]);

    return [setNode];
};

const AnimatedComponent: React.FC<{children: React.ReactNode, className?: string, delay?: number}> = ({ children, className, delay = 0 }) => {
    const [ref] = useIntersectionObserver({ threshold: 0.1 });
    return (
        <div 
            ref={ref as any} 
            className={`transition-all duration-1000 transform opacity-0 translate-y-8 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- SUB-COMPONENTS ---
const HeroSection: React.FC = () => {
    return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center text-center overflow-hidden bg-dark-900 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.1)_0%,_transparent_40%)]"></div>
        <div className="animated-grid opacity-50"></div>

        <div className="relative z-10 p-4">
            <AnimatedComponent>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                    Архитектура Вашего
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
                        Финансового Будущего
                    </span>
                </h1>
            </AnimatedComponent>
            <AnimatedComponent delay={200}>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
                Nexus Capital — это гипер-реалистичный бизнес-симулятор, где вы запускаете Проекты, управляете финансированием и строите свою команду, чтобы занять место в Совете Директоров.
            </p>
            </AnimatedComponent>
            <AnimatedComponent delay={400}>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/register"><Button variant="primary" className="w-full sm:w-auto !py-3 !px-8 !text-lg animate-glow">Начать Карьеру</Button></Link>
                <Link to="/how-it-works"><Button variant="secondary" className="w-full sm:w-auto !py-3 !px-8 !text-lg">Узнать больше</Button></Link>
            </div>
            </AnimatedComponent>
        </div>
    </section>
)};

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => {
    return (
        <div className="p-6 bg-dark-800/50 border border-dark-700 rounded-xl transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/10">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-dark-700 border border-dark-600 mb-6">
                <Icon className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
        </div>
    );
};

const ConceptSection: React.FC = () => (
    <section id="concept" className="py-20 px-4 bg-dark-800">
        <div className="container mx-auto">
             <AnimatedComponent>
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Концепция: Три столпа вашего успеха</h2>
            </AnimatedComponent>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
                <AnimatedComponent delay={100}><FeatureCard icon={Briefcase} title="Проекты">Станьте CEO. Начните с 'Pre-seed' Проекта, привлекайте финансирование и реинвестируйте прибыль в более масштабные идеи.</FeatureCard></AnimatedComponent>
                <AnimatedComponent delay={200}><FeatureCard icon={Users} title="Бизнес-сеть">Ваш успех — это команда. Приглашайте Партнеров, продавайте им Доли и получайте командные бонусы от всей структуры.</FeatureCard></AnimatedComponent>
                <AnimatedComponent delay={300}><FeatureCard icon={TrendingUp} title="Капитал">Управляйте своим виртуальным капиталом ($CAP), выводите прибыль и масштабируйте свою финансовую империю.</FeatureCard></AnimatedComponent>
            </div>
        </div>
    </section>
);

const HowItWorksSection: React.FC = () => {
    const steps = [
        { icon: Rocket, title: "Регистрация", description: "Создайте аккаунт и получите доступ к своему CEO-кабинету." },
        { icon: Briefcase, title: "Запуск Проекта", description: "Активируйте свой первый проект 'Pre-seed', чтобы начать." },
        { icon: Users, title: "Построение сети", description: "Продавайте доли проекта, приглашая партнеров по своей ссылке." },
        { icon: ShieldCheck, title: "Финансирование", description: "Получите прибыль, когда все доли вашего проекта будут проданы." },
        { icon: Award, title: "Масштабирование", description: "Переходите к более дорогим проектам и увеличивайте свой доход." },
    ];
    return (
        <section id="how-it-works" className="py-20 px-4 bg-dark-900">
            <div className="container mx-auto">
                 <AnimatedComponent>
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Как это работает?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-center">Пять простых шагов к построению вашей империи.</p>
                </AnimatedComponent>
                <div className="relative mt-12">
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-dark-700"></div>
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5">
                        <div className="bg-gradient-to-r from-brand-primary to-brand-accent h-full w-full animate-draw-line" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}></div>
                    </div>
                    <div className="grid md:grid-cols-5 gap-8 relative">
                        {steps.map((step, index) => (
                             <AnimatedComponent key={index} delay={index * 150} className="text-center">
                                <div className="relative">
                                    <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dark-800 border-2 border-brand-primary mb-4">
                                        <step.icon className="h-8 w-8 text-brand-primary"/>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                                <p className="text-sm text-gray-400 mt-2">{step.description}</p>
                            </AnimatedComponent>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const ToolsSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        { name: 'AI-Ассистент', icon: Bot, content: "Ваш персональный стратег. Генерирует маркетинговый контент, анализирует команду и дает прогнозы для принятия верных решений.", image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800" },
        { name: 'Стратегический Оверлей', icon: BarChart3, content: "Визуальный интерфейс для управления проектом, который объединяет аналитику, прогнозы прибыли и AI-подсказки для максимальной эффективности.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800" },
        { name: 'Аналитика', icon: TrendingUp, content: "Глубокие данные по вашему капиталу, бизнес-сети и рыночным трендам. Принимайте решения, основанные на фактах, а не на догадках.", image: "https://images.unsplash.com/photo-1611974780784-3c6ce8b10e1b?w=800" },
    ];

    return (
        <section className="py-20 px-4 bg-dark-800">
            <div className="container mx-auto">
                 <AnimatedComponent>
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Ваши Инструменты</h2>
                </AnimatedComponent>
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="flex justify-center border-b border-dark-700">
                        {tabs.map((tab, index) => (
                            <button key={tab.name} onClick={() => setActiveTab(index)} className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 ${activeTab === index ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white'}`}>
                                <tab.icon className="h-5 w-5"/> {tab.name}
                            </button>
                        ))}
                    </div>
                    <div className="mt-8">
                        {tabs.map((tab, index) => (
                            <div key={tab.name} className={`grid md:grid-cols-2 gap-8 items-center ${activeTab === index ? 'block' : 'hidden'}`}>
                                <AnimatedComponent>
                                    <h3 className="text-2xl font-bold text-white mb-4">{tab.name}</h3>
                                    <p className="text-gray-300">{tab.content}</p>
                                </AnimatedComponent>
                                 <AnimatedComponent>
                                    <img src={tab.image} alt={tab.name} className="rounded-lg shadow-lg" />
                                </AnimatedComponent>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const EconomicsSection: React.FC = () => {
    const data = [
        { name: 'Сеть (Партнерам)', value: 70, color: '#0ea5e9' },
        { name: 'Фонд (Развитие)', value: 30, color: '#2dd4bf' },
    ];
    return (
        <section className="py-20 px-4 bg-dark-900">
             <AnimatedComponent>
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Экономика Платформы</h2>
             </AnimatedComponent>
             <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto mt-12">
                 <AnimatedComponent className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}/>
                        </PieChart>
                     </ResponsiveContainer>
                 </AnimatedComponent>
                  <AnimatedComponent>
                    <p className="text-lg text-gray-300">Мы создали прозрачную и самодостаточную экономическую модель, где <span className="font-bold text-brand-primary">70%</span> от стоимости каждой проданной Доли мгновенно распределяется в Бизнес-сеть, а <span className="font-bold text-brand-accent">30%</span> идут в Операционный Фонд для развития платформы и вознаграждения лидеров.</p>
                </AnimatedComponent>
             </div>
        </section>
    );
};

const SocialProofSection: React.FC = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const testimonials = MOCK_LEADERS.slice(0,3).map(l => ({
        name: l.name,
        role: l.careerRank,
        avatar: l.avatarUrl,
        text: `Nexus Capital изменил мою жизнь. За первый месяц я вышел на доход, о котором раньше мог только мечтать. Система прозрачна, а команда всегда помогает.`
    }));
    
    const nextTestimonial = () => setCurrentTestimonial(p => (p + 1) % testimonials.length);
    const prevTestimonial = () => setCurrentTestimonial(p => (p - 1 + testimonials.length) % testimonials.length);

    const useAnimatedCounter = (endValue: number) => {
        const [count, setCount] = useState(0);
        const [ref, setRef] = useState<HTMLParagraphElement | null>(null);

        useEffect(() => {
            if (ref) {
                 const observer = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        let start = 0;
                        const duration = 2000;
                        const startTime = performance.now();
                        const run = (currentTime: number) => {
                            const elapsedTime = currentTime - startTime;
                            const progress = Math.min(elapsedTime / duration, 1);
                            setCount(Math.floor(progress * endValue));
                            if (progress < 1) requestAnimationFrame(run);
                        };
                        requestAnimationFrame(run);
                        observer.unobserve(ref);
                    }
                }, { threshold: 0.5 });
                observer.observe(ref);
                return () => observer.disconnect();
            }
        }, [ref, endValue]);

        return { count: count.toLocaleString('ru-RU'), ref: setRef };
    };

    const partners = useAnimatedCounter(MOCK_MARKET_STATS.totalPartners);
    const profit = useAnimatedCounter(Math.round(MOCK_MARKET_STATS.totalProfit));

    return (
        <section className="py-20 px-4 bg-dark-800">
            <div className="container mx-auto">
                <AnimatedComponent>
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Нам доверяют тысячи</h2>
                </AnimatedComponent>
                <div className="grid md:grid-cols-2 gap-12 mt-12 items-center">
                    <div className="space-y-8">
                        <AnimatedComponent>
                            <p ref={partners.ref} className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">{partners.count}+</p>
                            <p className="text-gray-400">Партнеров в системе</p>
                        </AnimatedComponent>
                        <AnimatedComponent>
                            <p ref={profit.ref} className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">${profit.count}+</p>
                            <p className="text-gray-400">Прибыли выплачено ($CAP)</p>
                        </AnimatedComponent>
                    </div>
                     <AnimatedComponent>
                        <div className="bg-dark-900/50 p-8 rounded-xl relative">
                            <div className="overflow-hidden relative h-48">
                                {testimonials.map((t, i) => (
                                    <div key={i} className={`absolute w-full text-center transition-opacity duration-500 ${i === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}>
                                        <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-4"/>
                                        <p className="italic text-gray-300">"{t.text}"</p>
                                        <p className="font-bold text-white mt-4">{t.name}</p>
                                        <p className="text-sm text-brand-accent">{t.role}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={prevTestimonial} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-700/50 hover:bg-dark-700"><ChevronLeft/></button>
                            <button onClick={nextTestimonial} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-700/50 hover:bg-dark-700"><ChevronRight/></button>
                        </div>
                    </AnimatedComponent>
                </div>
            </div>
        </section>
    );
};

const FinalCTASection: React.FC = () => (
    <section className="py-24 px-4 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/10 to-transparent"></div>
        <div className="container mx-auto text-center max-w-3xl relative z-10">
            <AnimatedComponent>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                    Ваше место в <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">'Совете Директоров'</span> ждет.
                </h2>
                <p className="mt-6 text-lg text-gray-300">Присоединяйтесь к элитному сообществу стратегов и начните строить свою финансовую империю уже сегодня.</p>
                <Link to="/register">
                    <Button variant="primary" className="mt-10 !py-4 !px-10 !text-xl animate-glow">
                        Присоединиться к Nexus Capital
                    </Button>
                </Link>
            </AnimatedComponent>
        </div>
    </section>
);


const LandingPageView: React.FC = () => {
    return (
        <div className="bg-dark-900 text-gray-200 font-sans w-full">
            <main>
                <HeroSection />
                <ConceptSection />
                <HowItWorksSection />
                <ToolsSection />
                <EconomicsSection />
                <SocialProofSection />
                <FinalCTASection />
            </main>
        </div>
    );
};

export default LandingPageView;