
import type { Partner, Project, Leader, Transaction, MarketStats, Achievement, Notification, LiveFeedEvent, Review, NewsArticle, AcademyArticle, Mission, PromoMaterial, ChatMessage, OnlineUser, NetworkGoal, BoardroomMember, BoardroomVote, CareerRank } from './types.ts';
import { Award, CheckCircle, Gift, Network, Rocket, ShieldCheck, Target, Users, UserPlus, DollarSign, Share2, GraduationCap, Megaphone, ListTodo, BotMessageSquare, Video, BookText, Edit3, MessageSquare, Star, Briefcase, TrendingUp } from 'lucide-react';

export const MOCK_USERS_DB: { [id: string]: { id: string; name: string; avatarUrl: string; level: number; rank: CareerRank } } = {
  'U12345': { id: 'U12345', name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345', level: 5, rank: 'Партнер' },
  'U67890': { id: 'U67890', name: 'Мария Соколова', avatarUrl: 'https://i.pravatar.cc/150?u=U67890', level: 4, rank: 'Партнер' },
  'UABCDE': { id: 'UABCDE', name: 'Сергей Новиков', avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE', level: 3, rank: 'Аналитик' },
  'L1': { id: 'L1', name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1', level: 12, rank: 'Старший Партнер' },
  'L2': { id: 'L2', name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2', level: 10, rank: 'Старший Партнер' },
};


export const MOCK_TRANSACTIONS: Transaction[] = [
    { 
        id: 'T009', 
        type: 'transfer', 
        amount: -25.00, 
        date: '2024-07-21', 
        status: 'completed',
        sender: MOCK_USERS_DB['U12345'],
        recipient: MOCK_USERS_DB['U67890'],
        comment: 'Спасибо за помощь!'
    },
    { id: 'T001', type: 'profit', amount: 50.00, date: '2024-07-20', status: 'completed' },
    { 
        id: 'T010', 
        type: 'transfer', 
        amount: 75.00, 
        date: '2024-07-20', 
        status: 'completed',
        sender: MOCK_USERS_DB['L1'],
        recipient: MOCK_USERS_DB['U12345'],
    },
    { id: 'T002', type: 'withdrawal', amount: -200.00, date: '2024-07-19', status: 'completed' },
    { id: 'T003', type: 'deposit', amount: 100.00, date: '2024-07-18', status: 'completed' },
    { id: 'T004', type: 'profit', amount: 25.50, date: '2024-07-17', status: 'completed' },
    { id: 'T005', type: 'investment', amount: -10.00, date: '2024-07-15', status: 'completed' },
    { id: 'T006', type: 'withdrawal', amount: -50.00, date: '2024-07-14', status: 'pending' },
    { id: 'T007', type: 'deposit', amount: 500.00, date: '2024-07-12', status: 'completed' },
    { id: 'T008', type: 'profit', amount: 150.00, date: '2024-07-11', status: 'completed' },
];

const CALCULATED_BALANCE = MOCK_TRANSACTIONS.reduce((acc, t) => acc + t.amount, 0);

export const MOCK_PARTNER: Partner = {
    id: 'U12345',
    name: 'Алексей Волков',
    avatarUrl: 'https://i.pravatar.cc/150?u=U12345',
    level: 5,
    capital: CALCULATED_BALANCE,
    reputation: 1250,
    rank: 'Партнер',
    partners: 14,
    fundingCompleted: 3,
    networkProfit: 1250.75,
    referralLink: 'https://nexus.capital/join?ref=U12345',
    joinDate: '2024-06-01',
    welcomeMessage: 'Привет! Меня зовут Алексей. Присоединяйся к моей Бизнес-сети в Nexus Capital, и давай вместе инвестировать в будущее!',
    bio: 'Эксперт по построению больших команд. Помогу каждому партнеру выйти на доход от $1000 CAP в первый месяц.',
    socials: {
        telegram: 'alex_volkov',
        linkedin: 'alexey-volkov-dev',
        website: 'alex-volkov.com',
        vk: 'alex_volkov_vk'
    }
};

export const MOCK_MARKET_STATS: MarketStats = {
    totalPartners: 8743,
    totalProfit: 125670.50,
    newPartnersToday: 128,
    activeProjects: 3452,
};

export const MOCK_EARNINGS_7_DAYS: { day: string; earnings: number }[] = [
    { day: 'Пн', earnings: 75 },
    { day: 'Вт', earnings: 50 },
    { day: 'Ср', earnings: 125 },
    { day: 'Чт', earnings: 90 },
    { day: 'Пт', earnings: 250 },
    { day: 'Сб', earnings: 180 },
    { day: 'Сегодня', earnings: 300 },
];

export const MOCK_PROJECTS: Project[] = [
    { id: 'P01', type: 'Pre-seed', entryCost: 100, totalShares: 12, sharesSold: 8, isActive: true, milestones: [{shares: 3, label: '3'}, {shares: 12, label: '12'}] },
    { id: 'P02', type: 'Series A', entryCost: 400, totalShares: 39, sharesSold: 15, isActive: false, milestones: [{shares: 3, label: '3'}, {shares: 12, label: '12'}, {shares: 39, label: '39'}] },
    { id: 'P03', type: 'IPO Stage', entryCost: 2000, totalShares: 120, sharesSold: 0, isActive: false, milestones: [{shares: 3, label: '3'}, {shares: 12, label: '12'}, {shares: 39, label: '39'}, {shares: 120, label: '120'}] },
];

export const MOCK_LEADERS: Leader[] = [
    { id: 'L1', rank: 1, name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1', earnings: 15200.50, level: 12, careerRank: 'Старший Партнер' },
    { id: 'L2', rank: 2, name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2', earnings: 11850.00, level: 10, careerRank: 'Старший Партнер' },
    { id: 'L3', rank: 3, name: 'Виктория Белова', avatarUrl: 'https://i.pravatar.cc/150?u=L3', earnings: 9750.25, level: 9, careerRank: 'Партнер' },
    { id: 'U12345', rank: 4, name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345', earnings: MOCK_PARTNER.capital, level: MOCK_PARTNER.level, careerRank: MOCK_PARTNER.rank },
    { id: 'L5', rank: 5, name: 'Ирина Ковалева', avatarUrl: 'https://i.pravatar.cc/150?u=L5', earnings: 5600.00, level: 7, careerRank: 'Партнер' },
    { id: 'L6', rank: 6, name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/150?u=L6', earnings: 4900.80, level: 6, careerRank: 'Партнер' },
];

export const MOCK_NETWORK_MEMBERS: Partner[] = [
    { id: 'U67890', name: 'Мария Соколова', avatarUrl: 'https://i.pravatar.cc/150?u=U67890', joinDate: '2024-06-15', level: 4, partners: 2, status: 'active', capital: 850, reputation: 800, rank: 'Партнер', fundingCompleted: 2, referralLink: 'https://nexus.capital/join?ref=U67890' },
    { id: 'UABCDE', name: 'Сергей Новиков', avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE', joinDate: '2024-06-20', level: 3, partners: 1, status: 'active', capital: 400, reputation: 450, rank: 'Аналитик', fundingCompleted: 1, referralLink: 'https://nexus.capital/join?ref=UABCDE' },
    { id: 'REF003', name: 'Екатерина Иванова', avatarUrl: 'https://i.pravatar.cc/150?u=REF003', joinDate: '2024-06-22', level: 2, partners: 5, status: 'active', capital: 1200, reputation: 320, rank: 'Аналитик', fundingCompleted: 4, referralLink: 'https://nexus.capital/join?ref=REF003' },
    { id: 'REF004', name: 'Дмитрий Петров', avatarUrl: 'https://i.pravatar.cc/150?u=REF004', joinDate: '2024-06-25', level: 2, partners: 0, status: 'inactive', capital: 50, reputation: 100, rank: 'Аналитик', fundingCompleted: 0, referralLink: 'https://nexus.capital/join?ref=REF004' },
    { id: 'REF005', name: 'Ольга Смирнова', avatarUrl: 'https://i.pravatar.cc/150?u=REF005', joinDate: '2024-07-01', level: 1, partners: 3, status: 'active', capital: 600, reputation: 150, rank: 'Стажер', fundingCompleted: 1, referralLink: 'https://nexus.capital/join?ref=REF005' },
    ...Array.from({ length: 12 }, (_, i): Partner => ({
      id: `REF${i + 6}`,
      name: `Партнер ${i + 6}`,
      avatarUrl: `https://i.pravatar.cc/150?u=REF${i + 6}`,
      joinDate: `2024-07-${10 + i}`,
      level: 1,
      partners: i % 3,
      status: i % 2 === 0 ? 'active' : 'inactive' as 'active' | 'inactive',
      capital: (i % 3) * 150 + (i * 10),
      reputation: 50 + (i*10),
      rank: 'Стажер',
      fundingCompleted: Math.floor((i % 3) / 2),
      referralLink: `https://nexus.capital/join?ref=REF${i + 6}`,
    })),
];


export const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: 'ach01', title: 'Добро пожаловать!', description: 'Вы успешно зарегистрировались и готовы строить свою империю.', icon: Rocket, unlocked: true, category: 'Карьера' },
    { id: 'ach02', title: 'Первый Партнер', description: 'Вы привлекли своего первого партнера в Бизнес-сеть.', icon: Users, unlocked: true, category: 'Лидерство' },
    { id: 'ach03', title: 'Ядро Бизнес-сети', description: 'Пригласите 10 личных партнеров.', icon: Target, unlocked: true, progress: { current: MOCK_PARTNER.partners, target: 10 }, category: 'Лидерство' },
    { id: 'ach04', title: 'Первое Финансирование', description: 'Вы успешно закрыли первый раунд финансирования.', icon: ShieldCheck, unlocked: true, category: 'Карьера' },
    { id: 'ach05', title: 'Серийный предприниматель', description: 'Успешно закройте 5 раундов.', icon: Briefcase, unlocked: false, progress: { current: MOCK_PARTNER.fundingCompleted, target: 5 }, category: 'Карьера' },
    { id: 'ach06', title: 'Рост Бизнес-сети', description: 'Ваша Бизнес-сеть достигла 25 партнеров.', icon: Network, unlocked: false, progress: { current: 18, target: 25 }, category: 'Лидерство' },
    { id: 'ach07', title: 'Первая прибыль', description: 'Заработайте свои первые $100 CAP.', icon: Gift, unlocked: true, category: 'Финансы' },
    { id: 'ach08', title: 'Капиталист', description: 'Достигните баланса в $1000 CAP.', icon: CheckCircle, unlocked: true, progress: { current: MOCK_PARTNER.capital, target: 1000 }, category: 'Финансы' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'N001',
        icon: UserPlus,
        title: 'Новый партнер!',
        description: 'Пользователь "Иван Петров" присоединился по вашей ссылке.',
        timestamp: '5 минут назад',
        isRead: false,
        type: 'standard',
    },
    {
        id: 'N002',
        icon: ShieldCheck,
        title: 'Проект профинансирован!',
        description: 'Вы получили Полное Финансирование для Проекта "Pre-seed" и получили прибыль.',
        timestamp: '2 часа назад',
        isRead: false,
        type: 'standard',
    },
    {
        id: 'N003',
        icon: DollarSign,
        title: 'Продажа $CAP',
        description: 'Ваш запрос на продажу $50.00 CAP был успешно обработан.',
        timestamp: '1 день назад',
        isRead: true,
        type: 'standard',
    },
];

export const MOCK_LIVE_FEED_EVENTS: LiveFeedEvent[] = [
    { id: 'EVT001', type: 'registration', user: { name: 'Елена С.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT1' }, timestamp: new Date(Date.now() - 15 * 1000) },
    { id: 'EVT002', type: 'withdrawal', user: { name: 'Дмитрий Г.', avatarUrl: 'https://i.pravatar.cc/150?u=L2' }, amount: 150.00, timestamp: new Date(Date.now() - 2 * 60 * 1000) },
    { id: 'EVT003', type: 'new_level', user: { name: 'Виктория Б.', avatarUrl: 'https://i.pravatar.cc/150?u=L3' }, level: 10, timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { id: 'EVT004', type: 'funding_completed', user: { name: 'Ирина К.', avatarUrl: 'https://i.pravatar.cc/150?u=L5' }, amount: 75.00, timestamp: new Date(Date.now() - 10 * 60 * 1000) },
    { id: 'EVT005', type: 'deposit', user: { name: 'Андрей С.', avatarUrl: 'https://i.pravatar.cc/150?u=L6' }, amount: 200.00, timestamp: new Date(Date.now() - 25 * 60 * 1000) },
    { id: 'EVT006', type: 'upgrade', user: { name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345' }, level: 6, timestamp: new Date(Date.now() - 30 * 60 * 1000) },
];

export const MOCK_REVIEWS: Review[] = [
    {
        id: 'REV001',
        user: { name: 'Ирина Ковалева', avatarUrl: 'https://i.pravatar.cc/150?u=L5' },
        rating: 5,
        text: "Платформа просто супер! Уже через неделю вышла на первый серьезный доход. Все прозрачно и понятно, Бизнес-сеть всегда помогает. Рекомендую всем, кто хочет изменить свою жизнь!",
        timestamp: '2024-07-20',
    },
];

export const MOCK_NEWS: NewsArticle[] = [
    {
        id: 'NEWS001',
        title: '🎉 Грандиозный запуск "Nexus Capital"!',
        content: 'Мы рады объявить об официальном старте нашего проекта! Присоединяйтесь к нам сегодня, чтобы стать частью революции в мире онлайн-инвестиций. Первые Партнеры получат эксклюзивные бонусы!',
        timestamp: '2024-07-25',
    },
];

export const MOCK_ACADEMY_ARTICLES: AcademyArticle[] = [
    { id: 'A001', title: 'Как привлечь первого партнера за 24 часа', category: 'Для новичков', type: 'video', duration: '12:35', coverUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false, rewardRP: 50, isCompleted: true, content: 'В этом видео мы подробно разбираем три самых эффективных способа найти первого партнера в вашу команду уже в первые сутки после регистрации. Пошаговая инструкция, готовые скрипты и полезные советы.' },
    { id: 'A002', title: 'Психология убеждения в бизнесе', category: 'Масштабирование', type: 'article', coverUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false, rewardRP: 75, isCompleted: false, content: 'Понимание психологии — ключ к успешным приглашениям. В этой статье мы рассмотрим:\n\n1.  **Триггеры доверия:** Как вызвать доверие у потенциального партнера.\n2.  **Работа с возражениями:** Превращаем "я подумаю" в "куда инвестировать?".\n3.  **Эмоциональная связь:** Почему люди присоединяются к людям, а не к компаниям.' },
    { id: 'A003', title: 'Стратегия: "Филиалы" и "Транши от Бизнес-сети"', category: 'Стратегия', type: 'video', duration: '25:10', coverUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false, rewardRP: 100, isCompleted: false, content: 'Глубокое погружение в самые интересные механики нашей платформы. Вы узнаете, как "Филиалы" помогают вам зарабатывать снова и снова, а "Транши от Бизнес-сети" от вышестоящих Партнеров ускоряют получение Полного Финансирования.' },
];


export const MOCK_MISSIONS: Mission[] = [
    // Onboarding Tasks
    { id: 'O01', category: 'Путь Партнера', title: 'Завершить регистрацию', description: 'Заполните свой профиль, добавив аватар и информацию о себе. Это повысит доверие к вам.', rewardRP: 50, icon: Edit3, status: 'claimed', actionText: 'В профиль', actionType: 'navigate', target: 'profile' },
    { id: 'O02', category: 'Путь Партнера', title: 'Изучить основы', description: 'Прочтите раздел "Как это работает", чтобы понять ключевые механики платформы.', rewardRP: 25, icon: GraduationCap, status: 'claimed', actionText: 'Читать', actionType: 'navigate', target: 'howitworks' },
    { id: 'O03', category: 'Путь Партнера', title: 'Поздороваться с коллегами', description: 'Напишите приветственное сообщение в общем чате. Будьте активны!', rewardRP: 15, icon: MessageSquare, status: 'available', actionText: 'Перейти в чат', actionType: 'navigate', target: 'chat' },

    // Daily Tasks
    { id: 'D01', category: 'Ежедневные Брифинги', title: 'Ежедневный вход', description: 'Заходите каждый день, чтобы получить бонус и быть в курсе событий.', rewardRP: 10, icon: ListTodo, status: 'claimed', actionText: 'Выполнено', actionType: 'none' },
    { id: 'D02', category: 'Ежедневные Брифинги', title: 'Магия AI-Ассистента', description: 'Создайте уникальный пост для своих социальных сетей с помощью N.C.A.', rewardRP: 15, icon: BotMessageSquare, status: 'available', actionText: 'Создать', actionType: 'open_assistant' },
    { id: 'D03', category: 'Ежедневные Брифинги', title: 'Рассказать о себе', description: 'Поделитесь своей ссылкой для партнеров в любой социальной сети или мессенджере.', rewardRP: 25, icon: Share2, status: 'completed', actionText: 'Поделиться', actionType: 'copy' },
    
    // Weekly
    { id: 'W01', category: 'Еженедельные Контракты', title: 'Сетевой бустер', description: 'Пригласите 3 новых партнеров в свою Бизнес-сеть за эту неделю.', rewardRP: 150, rewardCAP: 50, icon: UserPlus, status: 'in_progress', progress: {current: 1, target: 3}, actionText: 'Скопировать ссылку', actionType: 'copy'}
];

export const MOCK_PROMO_MATERIALS: PromoMaterial[] = [
    { id: 'P01', type: 'banner', title: 'Баннер для поста (Квадрат)', content: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=1200&q=80', size: '1200x1200' },
    { id: 'P02', type: 'banner', title: 'Баннер для Stories', content: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&h=1920&q=80', size: '1080x1920' },
    { id: 'P03', type: 'text', title: 'Текст для Telegram', content: `🔥 **Готовы инвестировать в будущее?** 🔥

Ищете способ зарабатывать онлайн, но не знаете, с чего начать?

**Nexus Capital** — это не просто платформа, это ваш шанс построить собственный инвестиционный портфель с минимальными вложениями.

✅ Прозрачная экономика
✅ Мощная Бизнес-сеть и поддержка 24/7
✅ Автоматизированная система "Филиалов" и "Траншей от Бизнес-сети"

Не упусти свой шанс! Напиши мне "ХОЧУ В КОМАНДУ", и я расскажу все подробности. 👇`},
];

export const PINNED_CHAT_MESSAGE: ChatMessage = {
    id: 'MSG_PINNED',
    type: 'announcement',
    user: { ...MOCK_USERS_DB['L1'], id: 'L1' },
    text: '🚀 Внимание, Партнеры! В эту субботу в 18:00 МСК состоится вебинар по новым инвестиционным стратегиям. Явка обязательна для всех, кто хочет удвоить свой капитал! Ссылка будет здесь за час до начала.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
};

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    {
        id: 'MSG001',
        type: 'user',
        user: { ...MOCK_USERS_DB['L1'], id: 'L1' },
        text: 'Всем привет! Отличный день для получения Полного Финансирования!',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        reactions: { '🚀': ['U67890', 'UABCDE'] }
    },
];

export const MOCK_ONLINE_USERS: OnlineUser[] = [
    { id: MOCK_PARTNER.id, name: MOCK_PARTNER.name, avatarUrl: MOCK_PARTNER.avatarUrl, level: MOCK_PARTNER.level, partners: MOCK_PARTNER.partners, rank: MOCK_PARTNER.rank },
    ...Object.values(MOCK_USERS_DB),
    ...MOCK_LEADERS,
    ...MOCK_NETWORK_MEMBERS
].reduce((acc: OnlineUser[], current) => {
    if (!acc.some(item => item.id === current.id)) {
        const rank = (current as any).rank || (current as any).careerRank || 'Стажер';
        acc.push({ id: current.id, name: current.name, avatarUrl: current.avatarUrl, level: current.level, partners: (current as Partner).partners || 0, rank });
    }
    return acc;
}, []).slice(0, 15);

export const CHAT_RULES = [
    { title: 'Будьте вежливы', content: 'Относитесь ко всем Партнерам с уважением. Оскорбления, троллинг и разжигание конфликтов строго запрещены.' },
    { title: 'Без спама и флуда', content: 'Не отправляйте повторяющиеся сообщения. Реклама сторонних проектов, товаров или услуг запрещена.' },
    { title: 'По теме платформы', content: 'Придерживайтесь тематики Nexus Capital. Делитесь успехами, задавайте вопросы, помогайте новичкам.' },
    { title: 'Конфиденциальность', content: 'Не делитесь личной информацией (телефонами, адресами, паролями) в общем чате.' },
];

export const MOCK_NETWORK_GOAL: NetworkGoal = {
    id: 'GOAL1',
    title: 'Привлечь 50 новых партнеров в этом месяце',
    description: 'Общая цель для всей Бизнес-сети для получения командного бонуса.',
    progress: 35,
    target: 50,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    reward: '+10% к доходу для всех',
};

// --- MOCK DATA FOR DASHBOARD ---
export const MOCK_CAPITAL_HISTORY_30_DAYS = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const balance = 500 + i * 15 + Math.sin(i / 3) * 50 + Math.random() * 60;
    return {
        date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
        balance: parseFloat(balance.toFixed(2)),
    };
});

export const MOCK_PORTFOLIO_PROJECTS = [
    { id: 'S01', name: 'Проект "Pre-seed"', stage: { name: 'Финансирование', color: '#3b82f6' }, progress: [100, 75, 0], nextMilestone: 'Продать 4 Доли' },
    { id: 'S02', name: 'Проект "Series A"', stage: { name: 'Масштабирование', color: '#2dd4bf' }, progress: [100, 100, 40], nextMilestone: 'Получить Полное Финансирование' },
];

export const MOCK_MARKET_PULSE = [
    { id: 'fintech', name: 'Финтех', avgROI: 250, avgExitTime: 14, isTrending: true },
    { id: 'ai', name: 'ИИ и МО', avgROI: 180, avgExitTime: 21, isTrending: false },
    { id: 'greentech', name: 'Зеленые технологии', avgROI: 150, avgExitTime: 25, isTrending: false },
];

export const MOCK_BOARDROOM_DATA: {
    members: BoardroomMember[];
    globalBonusPool: number;
    activeVote: BoardroomVote | null;
} = {
    members: MOCK_LEADERS.slice(0, 5).map((leader, index) => ({
        ...leader,
        influence: 100 - (index * 10),
    })) as BoardroomMember[],
    globalBonusPool: 75340,
    activeVote: {
        id: 'VOTE001',
        title: 'Увеличить Операционные Расходы до 35% для финансирования маркетинговой кампании?',
        description: 'Это позволит нам запустить масштабную рекламную кампанию и ускорить рост платформы, что в долгосрочной перспективе выгодно всем. Однако, это временно увеличит расходы партнеров при запуске Проектов.',
        options: [
            { id: 'opt1', text: 'Да, увеличить', votes: 450 },
            { id: 'opt2', text: 'Нет, оставить 30%', votes: 280 },
        ],
        totalVotes: 730,
        endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        userVote: undefined,
    }
};

export const RANK_THRESHOLDS: { [key in CareerRank]: number } = {
    'Стажер': 0,
    'Аналитик': 500,
    'Партнер': 1000,
    'Старший Партнер': 5000,
    'Директор': 20000,
};
