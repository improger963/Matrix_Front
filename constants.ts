
import type { Tycoon, ProjectNode, Leader, Transaction, MetropolisStats, GuildMember, Achievement, Notification, LiveFeedEvent, Review, NewsArticle, AcademyArticle, DailyTask, PromoMaterial, ChatMessage, OnlineUser } from './types.ts';
import { Award, CheckCircle, Gift, Network, Rocket, ShieldCheck, Target, Users, UserPlus, DollarSign, Share2, GraduationCap, Megaphone, ListTodo, BotMessageSquare, Video, BookText, Edit3, MessageSquare, Star } from 'lucide-react';

export const MOCK_USERS_DB: { [id: string]: { id: string; name: string; avatarUrl: string; level: number; } } = {
  'U12345': { id: 'U12345', name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345', level: 5 },
  'U67890': { id: 'U67890', name: 'Мария Соколова', avatarUrl: 'https://i.pravatar.cc/150?u=U67890', level: 4 },
  'UABCDE': { id: 'UABCDE', name: 'Сергей Новиков', avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE', level: 3 },
  'L1': { id: 'L1', name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1', level: 12 },
  'L2': { id: 'L2', name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2', level: 10 },
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
    { id: 'T001', type: 'earning', amount: 50.00, date: '2024-07-20', status: 'completed' },
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
    { id: 'T004', type: 'earning', amount: 25.50, date: '2024-07-17', status: 'completed' },
    { id: 'T005', type: 'activation', amount: -10.00, date: '2024-07-15', status: 'completed' },
    { id: 'T006', type: 'withdrawal', amount: -50.00, date: '2024-07-14', status: 'pending' },
    { id: 'T007', type: 'deposit', amount: 500.00, date: '2024-07-12', status: 'completed' },
    { id: 'T008', type: 'earning', amount: 150.00, date: '2024-07-11', status: 'completed' },
];

const CALCULATED_BALANCE = MOCK_TRANSACTIONS.reduce((acc, t) => acc + t.amount, 0);

export const MOCK_TYCOON: Tycoon = {
    id: 'U12345',
    name: 'Алексей Волков',
    avatarUrl: 'https://i.pravatar.cc/150?u=U12345',
    level: 5,
    cityCredits: CALCULATED_BALANCE,
    xp: 125,
    investors: 14,
    projectsCompleted: 3,
    guildEarnings: 1250.75,
    referralLink: 'https://matrixflow.app/join?ref=U12345',
    joinDate: '2024-06-01',
    welcomeMessage: 'Привет! Меня зовут Алексей, и я помогу тебе стартовать в MatrixFlow. Присоединяйся к моей команде, и давай зарабатывать вместе!',
    bio: 'Эксперт по построению больших команд. Помогу каждому партнеру выйти на доход от $1000 в первый месяц.',
    socials: {
        telegram: 'alex_volkov',
        vk: 'avolkov',
        website: 'alex-volkov.com'
    }
};

export const MOCK_METROPOLIS_STATS: MetropolisStats = {
    totalTycoons: 8743,
    totalEarned: 125670.50,
    tycoonsToday: 128,
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

// --- Утилиты для обработки данных ---

const calculateDownline = (node: ProjectNode): number => {
    if (!node.children || node.children.length === 0) {
        return 0;
    }
    let count = 0;
    for (const child of node.children) {
        if (child.isFilled) {
            count++; // Считаем прямого заполненного потомка
            count += calculateDownline(child); // Добавляем его структуру
        }
    }
    return count;
};

const addDownlineToNode = (node: ProjectNode): ProjectNode => {
    const newNode = { ...node };
    if (newNode.isFilled) {
        newNode.downline = calculateDownline(newNode);
    }
    if (newNode.children) {
        newNode.children = newNode.children.map(addDownlineToNode);
    }
    return newNode;
};

const RAW_MOCK_PROJECT_DATA: ProjectNode = {
    id: 'U12345',
    name: 'Алексей В.',
    avatarUrl: 'https://i.pravatar.cc/150?u=U12345',
    isFilled: true,
    nodeType: 'self',
    joinDate: '2024-06-01',
    level: 5,
    investors: 2,
    lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    upgradeLevel: 1,
    district: "Жилой",
    children: [
        { 
            id: 'U67890',
            name: 'Мария С.',
            avatarUrl: 'https://i.pravatar.cc/150?u=U67890',
            isFilled: true,
            nodeType: 'spillover',
            joinDate: '2024-06-15',
            level: 4,
            investors: 2,
            lastActivityDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            upgradeLevel: 1,
            district: "Жилой",
            children: [
                { 
                    id: 'U11223', 
                    name: 'Иван П.', 
                    avatarUrl: 'https://i.pravatar.cc/150?u=U11223', 
                    isFilled: true,
                    branchHealth: 'healthy',
                    nodeType: 'self',
                    joinDate: '2024-07-02',
                    level: 3,
                    investors: 2,
                    lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    upgradeLevel: 1,
                    district: "Жилой",
                    children: [
                        { id: 'UCHILD1', name: 'Петр Ф.', nodeType: 'self', avatarUrl: 'https://i.pravatar.cc/150?u=UCHILD1', isFilled: true, joinDate: '2024-07-20', level: 2, investors: 0, lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), upgradeLevel: 1, district: "Жилой", },
                        { id: 'UCHILD2', name: 'Свободно', avatarUrl: '', isFilled: false, upgradeLevel: 1, district: "Жилой", }
                    ]
                },
                { 
                    id: 'U44556', 
                    name: 'Ольга К.', 
                    avatarUrl: 'https://i.pravatar.cc/150?u=U44556', 
                    isFilled: true, 
                    nodeType: 'self',
                    joinDate: '2024-07-10',
                    level: 2,
                    investors: 1,
                    lastActivityDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    upgradeLevel: 1,
                    district: "Жилой",
                    children: [
                        { id: 'UCHILD3', name: 'Екатерина Б.', nodeType: 'self', avatarUrl: 'https://i.pravatar.cc/150?u=UCHILD3', isFilled: true, joinDate: '2024-07-22', level: 1, investors: 0, lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), upgradeLevel: 1, district: "Жилой", },
                        { id: 'UCHILD4', name: 'Свободно', avatarUrl: '', isFilled: false, upgradeLevel: 1, district: "Жилой", }
                    ]
                }
            ]
        },
        { 
            id: 'UABCDE',
            name: 'Сергей Н.',
            avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE',
            isFilled: true,
            nodeType: 'self',
            joinDate: '2024-06-20',
            level: 3,
            investors: 1,
            lastActivityDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            upgradeLevel: 1,
            district: "Жилой",
            children: [
                { 
                    id: 'UFGHIJ', 
                    name: 'Анна Л.', 
                    avatarUrl: 'https://i.pravatar.cc/150?u=UFGHIJ', 
                    isFilled: true,
                    branchHealth: 'problematic',
                    nodeType: 'self',
                    joinDate: '2024-07-18',
                    level: 1,
                    investors: 0,
                    lastActivityDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
                    upgradeLevel: 1,
                    district: "Жилой",
                     children: [
                         { id: 'UCHILD5', name: 'Свободно', avatarUrl: '', isFilled: false, upgradeLevel: 1, district: "Жилой", },
                         { id: 'UCHILD6', name: 'Свободно', avatarUrl: '', isFilled: false, upgradeLevel: 1, district: "Жилой", }
                    ]
                },
                { 
                    id: 'CLONE1',
                    name: 'Алексей В. (Филиал)',
                    avatarUrl: 'https://i.pravatar.cc/150?u=U12345',
                    isFilled: true,
                    nodeType: 'clone',
                    joinDate: '2024-07-25',
                    level: 1,
                    investors: 0,
                    lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    upgradeLevel: 1,
                    district: "Жилой",
                    children: [
                         { id: 'UCHILD7', name: 'Свободно', avatarUrl: '', isFilled: false, upgradeLevel: 1, district: "Жилой", },
                         { id: 'UCHILD8', name: 'Свободно', avatarUrl: '', isFilled: false, upgradeLevel: 1, district: "Жилой", }
                    ]
                },
            ]
        }
    ]
};

export const MOCK_PROJECT_DATA: ProjectNode = addDownlineToNode(RAW_MOCK_PROJECT_DATA);


export const MOCK_LEADERS: Leader[] = [
    { id: 'L1', rank: 1, name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1', earnings: 15200.50, level: 12 },
    { id: 'L2', rank: 2, name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2', earnings: 11850.00, level: 10 },
    { id: 'L3', rank: 3, name: 'Виктория Белова', avatarUrl: 'https://i.pravatar.cc/150?u=L3', earnings: 9750.25, level: 9 },
    { id: 'U12345', rank: 4, name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345', earnings: MOCK_TYCOON.cityCredits, level: MOCK_TYCOON.level },
    { id: 'L5', rank: 5, name: 'Ирина Ковалева', avatarUrl: 'https://i.pravatar.cc/150?u=L5', earnings: 5600.00, level: 7 },
    { id: 'L6', rank: 6, name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/150?u=L6', earnings: 4900.80, level: 6 },
];

export const MOCK_GUILD_MEMBERS: GuildMember[] = [
    { id: 'U67890', name: 'Мария Соколова', avatarUrl: 'https://i.pravatar.cc/150?u=U67890', joinDate: '2024-06-15', level: 4, investors: 2, status: 'active' },
    { id: 'UABCDE', name: 'Сергей Новиков', avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE', joinDate: '2024-06-20', level: 3, investors: 1, status: 'active' },
    { id: 'REF003', name: 'Екатерина Иванова', avatarUrl: 'https://i.pravatar.cc/150?u=REF003', joinDate: '2024-06-22', level: 2, investors: 5, status: 'active' },
    { id: 'REF004', name: 'Дмитрий Петров', avatarUrl: 'https://i.pravatar.cc/150?u=REF004', joinDate: '2024-06-25', level: 2, investors: 0, status: 'inactive' },
    { id: 'REF005', name: 'Ольга Смирнова', avatarUrl: 'https://i.pravatar.cc/150?u=REF005', joinDate: '2024-07-01', level: 1, investors: 3, status: 'active' },
    { id: 'REF006', name: 'Андрей Кузнецов', avatarUrl: 'https://i.pravatar.cc/150?u=REF006', joinDate: '2024-07-03', level: 1, investors: 1, status: 'active' },
    { id: 'REF007', name: 'Ирина Васильева', avatarUrl: 'https://i.pravatar.cc/150?u=REF007', joinDate: '2024-07-05', level: 1, investors: 0, status: 'inactive' },
    ...Array.from({ length: 7 }, (_, i) => ({
      id: `REF${i + 8}`,
      name: `Партнер ${i + 8}`,
      avatarUrl: `https://i.pravatar.cc/150?u=REF${i + 8}`,
      joinDate: `2024-07-${10 + i}`,
      level: 1,
      investors: i % 3,
      status: i % 2 === 0 ? 'active' : 'inactive' as 'active' | 'inactive',
    })),
];


export const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: 'ach01', title: 'Добро пожаловать!', description: 'Вы успешно зарегистрировались в проекте.', icon: Rocket, unlocked: true, category: 'Milestone' },
    { id: 'ach02', title: 'Первые шаги', description: 'Пригласите своего первого партнера.', icon: Users, unlocked: true, category: 'Guild' },
    { id: 'ach03', title: 'Командный игрок', description: 'Пригласите 10 личных партнеров.', icon: Target, unlocked: true, progress: { current: MOCK_TYCOON.investors, target: 10 }, category: 'Guild' },
    { id: 'ach04', title: 'Закрыватель матриц', description: 'Закройте свою первую матрицу.', icon: ShieldCheck, unlocked: true, category: 'Personal' },
    { id: 'ach05', title: 'Мастер матриц', description: 'Закройте 5 матриц.', icon: Award, unlocked: false, progress: { current: MOCK_TYCOON.projectsCompleted, target: 5 }, category: 'Personal' },
    { id: 'ach06', title: 'Строитель сети', description: 'Ваша команда достигла 25 человек.', icon: Network, unlocked: false, progress: { current: 18, target: 25 }, category: 'Guild' },
    { id: 'ach07', title: 'Первый доход', description: 'Заработайте свои первые $100.', icon: Gift, unlocked: true, category: 'Financial' },
    { id: 'ach08', title: 'Инвестор', description: 'Достигните баланса в $1000.', icon: CheckCircle, unlocked: true, progress: { current: MOCK_TYCOON.cityCredits, target: 1000 }, category: 'Financial' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'N001',
        icon: UserPlus,
        title: 'Новый реферал!',
        description: 'Пользователь "Иван Петров" присоединился по вашей ссылке.',
        timestamp: '5 минут назад',
        isRead: false,
    },
    {
        id: 'N002',
        icon: ShieldCheck,
        title: 'Матрица закрыта',
        description: 'Вы успешно закрыли матрицу "Bronze" и получили вознаграждение.',
        timestamp: '2 часа назад',
        isRead: false,
    },
    {
        id: 'N003',
        icon: DollarSign,
        title: 'Вывод средств',
        description: 'Ваш запрос на вывод $50.00 был успешно обработан.',
        timestamp: '1 день назад',
        isRead: true,
    },
    {
        id: 'N004',
        icon: Award,
        title: 'Новое достижение',
        description: 'Вы разблокировали достижение "Командный игрок".',
        timestamp: '2 дня назад',
        isRead: true,
    },
];

export const MOCK_LIVE_FEED_EVENTS: LiveFeedEvent[] = [
    { id: 'EVT001', type: 'registration', user: { name: 'Елена С.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT1' }, timestamp: new Date(Date.now() - 15 * 1000) },
    { id: 'EVT002', type: 'withdrawal', user: { name: 'Дмитрий Г.', avatarUrl: 'https://i.pravatar.cc/150?u=L2' }, amount: 150.00, timestamp: new Date(Date.now() - 2 * 60 * 1000) },
    { id: 'EVT003', type: 'new_level', user: { name: 'Виктория Б.', avatarUrl: 'https://i.pravatar.cc/150?u=L3' }, level: 10, timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { id: 'EVT004', type: 'project_close', user: { name: 'Ирина К.', avatarUrl: 'https://i.pravatar.cc/150?u=L5' }, amount: 75.00, timestamp: new Date(Date.now() - 10 * 60 * 1000) },
    { id: 'EVT005', type: 'deposit', user: { name: 'Андрей С.', avatarUrl: 'https://i.pravatar.cc/150?u=L6' }, amount: 200.00, timestamp: new Date(Date.now() - 25 * 60 * 1000) },
    { id: 'EVT006', type: 'registration', user: { name: 'Ольга М.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT6' }, timestamp: new Date(Date.now() - 45 * 60 * 1000) },
    { id: 'EVT007', type: 'new_level', user: { name: 'Сергей Н.', avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE' }, level: 4, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { id: 'EVT008', type: 'registration', user: { name: 'Павел Р.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT8' }, timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000) },
    { id: 'EVT009', type: 'deposit', user: { name: 'Анна Л.', avatarUrl: 'https://i.pravatar.cc/150?u=UFGHIJ' }, amount: 50.00, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'EVT010', type: 'project_close', user: { name: 'Мария С.', avatarUrl: 'https://i.pravatar.cc/150?u=U67890' }, amount: 120.00, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'EVT011', type: 'withdrawal', user: { name: 'Иван П.', avatarUrl: 'https://i.pravatar.cc/150?u=U11223' }, amount: 80.00, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 'EVT012', type: 'new_level', user: { name: 'Ольга К.', avatarUrl: 'https://i.pravatar.cc/150?u=U44556' }, level: 3, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: 'EVT013', type: 'registration', user: { name: 'Кирилл В.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT13' }, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    { id: 'EVT014', type: 'deposit', user: { name: 'Светлана А.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT14' }, amount: 100.00, timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000) },
    { id: 'EVT015', type: 'new_level', user: { name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1' }, level: 13, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
    { id: 'EVT016', type: 'project_close', user: { name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2' }, amount: 250.00, timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000) },
    { id: 'EVT017', type: 'withdrawal', user: { name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345' }, amount: 100.00, timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000) },
    { id: 'EVT018', type: 'registration', user: { name: 'Наталья З.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT18' }, timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000) },
    { id: 'EVT019', type: 'deposit', user: { name: 'Ирина Ковалева', avatarUrl: 'https://i.pravatar.cc/150?u=L5' }, amount: 300.00, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    { id: 'EVT020', type: 'new_level', user: { name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/150?u=L6' }, level: 7, timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000) },
];

export const MOCK_REVIEWS: Review[] = [
    {
        id: 'REV001',
        user: { name: 'Ирина Ковалева', avatarUrl: 'https://i.pravatar.cc/150?u=L5' },
        rating: 5,
        text: "Проект просто супер! Уже через неделю вышла на первый серьезный доход. Все прозрачно и понятно, команда всегда помогает. Рекомендую всем, кто хочет изменить свою жизнь!",
        timestamp: '2024-07-20',
    },
    {
        id: 'REV002',
        user: { name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/150?u=L6' },
        rating: 5,
        text: "Сначала сомневался, но решил попробовать. Не жалею! Система переливов реально работает, даже новичку легко стартовать. Техподдержка отвечает быстро, что очень радует.",
        timestamp: '2024-07-18',
    },
    {
        id: 'REV003',
        user: { name: 'Ольга Смирнова', avatarUrl: 'https://i.pravatar.cc/150?u=REF005' },
        rating: 4,
        text: "В целом, все нравится. Чтобы хорошо зарабатывать, нужно активно работать и строить команду, это не кнопка 'бабло'. Но если приложить усилия, результат будет.",
        timestamp: '2024-07-15',
    },
    {
        id: 'REV004',
        user: { name: 'Максим Лебедев', avatarUrl: 'https://i.pravatar.cc/150?u=R4' },
        rating: 5,
        text: "Очень удобный личный кабинет, все интуитивно понятно. AI-копирайтер - это вообще пушка! Помогает создавать крутые посты для привлечения партнеров.",
        timestamp: '2024-07-22',
    }
];

export const MOCK_NEWS: NewsArticle[] = [
    {
        id: 'NEWS001',
        title: '🎉 Грандиозный запуск проекта MatrixFlow!',
        content: 'Мы рады объявить об официальном старте нашего проекта! Присоединяйтесь к нам сегодня, чтобы стать частью революции в мире матричных платформ. Первые участники получат эксклюзивные бонусы!',
        timestamp: '2024-07-25',
    },
    {
        id: 'NEWS002',
        title: '📈 Внедрение новой платежной системы',
        content: 'Для вашего удобства мы добавили возможность пополнения баланса и вывода средств через банковские карты. Теперь финансовые операции стали еще проще и доступнее.',
        timestamp: '2024-07-22',
    },
    {
        id: 'NEWS003',
        title: '🤖 Обновление AI-Копирайтера "Marketing Genius"',
        content: 'Наш AI-помощник стал еще умнее! Мы обновили его алгоритмы для генерации более креативных и убедительных рекламных текстов. Попробуйте прямо сейчас в соответствующем разделе.',
        timestamp: '2024-07-20',
    }
];

export const MOCK_ACADEMY_ARTICLES: AcademyArticle[] = [
    { id: 'A001', title: 'Как пригласить первого партнера за 24 часа', category: 'Для новичков', type: 'video', duration: '12:35', coverUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false, xpReward: 50, isCompleted: true, content: 'В этом видео мы подробно разбираем три самых эффективных способа найти первого партнера в вашу команду уже в первые сутки после регистрации. Пошаговая инструкция, готовые скрипты и полезные советы.' },
    { id: 'A002', title: 'Психология продаж в MLM', category: 'Продвижение', type: 'article', coverUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false, xpReward: 75, isCompleted: false, content: 'Понимание психологии — ключ к успешным приглашениям. В этой статье мы рассмотрим:\n\n1.  **Триггеры доверия:** Как вызвать доверие у потенциального партнера.\n2.  **Работа с возражениями:** Превращаем "нет" в "да".\n3.  **Эмоциональные продажи:** Почему люди присоединяются к людям, а не к компаниям.' },
    { id: 'A003', title: 'Разбор маркетинг-плана: "клоны" и "переливы"', category: 'Бизнес-план', type: 'video', duration: '25:10', coverUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false, xpReward: 100, isCompleted: false, content: 'Глубокое погружение в самые интересные механики нашего маркетинга. Вы узнаете, как "клоны" помогают вам зарабатывать снова и снова, а "переливы" от вышестоящих партнеров ускоряют закрытие ваших матриц.' },
    { id: 'A004', title: 'Эффективная работа с соцсетями', category: 'Продвижение', type: 'article', coverUrl: 'https://images.unsplash.com/photo-1611162617213-6d22e4ca1c78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: true, xpReward: 120, isCompleted: false, content: 'Этот урок доступен после достижения 5-го уровня. В нем мы раскроем секреты ведения Telegram-канала, ВКонтакте и других платформ для максимального эффекта.' },
    { id: 'A005', title: 'Как создать личный бренд', category: 'Продвижение', type: 'video', duration: '18:05', coverUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075a6b54a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: true, xpReward: 150, isCompleted: false, content: 'Доступно на 5-м уровне. Узнайте, как стать человеком, к которому хотят присоединиться. Мы поговорим о позиционировании, контенте и вовлечении аудитории.' },
    { id: 'A006', title: 'Финансовая грамотность для участника', category: 'Для новичков', type: 'article', coverUrl: 'https://images.unsplash.com/photo-1642792962358-83132a2e475c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false, xpReward: 60, isCompleted: false, content: 'Заработать деньги — это полдела. Важно правильно ими распоряжаться. В этой статье вы узнаете об основах финансовой безопасности, реинвестировании и планировании своего бюджета для достижения максимальных результатов в проекте.' },
];


export const MARKETING_GENIUS_TASK_ID = 'D02';

export const MOCK_ALL_TASKS: DailyTask[] = [
    // Onboarding Tasks
    { id: 'O01', category: 'onboarding', title: 'Завершить регистрацию', subtitle: 'Путь новичка: Шаг 1', description: 'Заполните свой профиль, добавив аватар и информацию о себе. Это повысит доверие к вам.', reward: 50, icon: Edit3, isCompleted: true, actionText: 'В профиль', actionType: 'navigate', target: 'profile' },
    { id: 'O02', category: 'onboarding', title: 'Изучить основы', subtitle: 'Путь новичка: Шаг 2', description: 'Прочтите раздел "Как это работает", чтобы понять ключевые механики проекта.', reward: 25, icon: GraduationCap, isCompleted: true, actionText: 'Читать', actionType: 'navigate', target: 'howitworks' },
    { id: 'O03', category: 'onboarding', title: 'Поздороваться с командой', subtitle: 'Путь новичка: Шаг 3', description: 'Напишите приветственное сообщение в общем чате. Будьте активны!', reward: 15, icon: MessageSquare, isCompleted: false, actionText: 'Перейти в чат', actionType: 'navigate', target: 'chat' },

    // Daily Tasks
    { id: 'D01', category: 'daily', title: 'Ежедневный вход', description: 'Заходите каждый день, чтобы получить бонус и быть в курсе событий.', reward: 10, icon: ListTodo, isCompleted: true, actionText: 'Выполнено', actionType: 'none' },
    { id: MARKETING_GENIUS_TASK_ID, category: 'daily', title: 'Магия AI-Копирайтера', description: 'Создайте уникальный пост для своих социальных сетей с помощью нашего AI-помощника.', reward: 15, icon: BotMessageSquare, isCompleted: false, actionText: 'Создать', actionType: 'navigate', target: 'marketing' },
    { id: 'D03', category: 'daily', title: 'Рассказать о себе', description: 'Поделитесь своей реферальной ссылкой в любой социальной сети или мессенджере.', reward: 25, icon: Share2, isCompleted: false, actionText: 'Поделиться', actionType: 'copy' },
    
    // Special Tasks
    { id: 'S01', category: 'special', title: 'Контракт "Лидер"', subtitle: 'Ограничено по времени', description: 'Пригласите 3-х активных партнеров за первую неделю и получите эксклюзивный бонус на баланс.', reward: 150, icon: Rocket, isCompleted: false, actionText: 'Подробнее', actionType: 'none', progress: { current: 1, target: 3 } },
    { id: 'S02', category: 'special', title: 'Контракт "Обратная связь"', description: 'Ваше мнение помогает нам стать лучше. Оставьте честный отзыв о проекте и получите награду.', reward: 100, icon: Star, isCompleted: false, actionText: 'Оставить отзыв', actionType: 'navigate', target: 'reviews' },
];


export const MOCK_PROMO_MATERIALS: PromoMaterial[] = [
    { id: 'P01', type: 'banner', title: 'Баннер для поста (Квадрат)', content: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=1200&q=80', size: '1200x1200' },
    { id: 'P02', type: 'banner', title: 'Баннер для Stories', content: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&h=1920&q=80', size: '1080x1920' },
    { id: 'P03', type: 'text', title: 'Текст для Telegram', content: `🔥 **Готов изменить свою жизнь?** 🔥

Надоело работать "на дядю"? Ищешь способ зарабатывать онлайн, но не знаешь, с чего начать?

У меня есть решение! **MatrixFlow** — это не просто проект, это твой шанс построить собственный бизнес с минимальными вложениями.

✅ Прозрачный маркетинг
✅ Мощная команда и поддержка 24/7
✅ Автоматизированная система "клонов" и "переливов"

Не упусти свой шанс! Напиши мне "ХОЧУ В КОМАНДУ", и я расскажу все подробности. 👇`},
    { id: 'P04', type: 'text', title: 'Короткое сообщение для WhatsApp', content: `Привет! 👋 Я сейчас развиваю очень интересный онлайн-проект с отличным доходом. Подумал(а), тебе тоже может быть интересно. Если ищешь новые возможности, дай знать, расскажу подробнее!` },
];

export const PINNED_CHAT_MESSAGE: ChatMessage = {
    id: 'MSG_PINNED',
    user: MOCK_USERS_DB['L1'],
    text: '🚀 Внимание, команда! В эту субботу в 18:00 МСК состоится вебинар по новым стратегиям продвижения. Явка обязательна для всех, кто хочет удвоить свой доход! Ссылка будет здесь за час до начала.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
};

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    {
        id: 'MSG001',
        user: MOCK_USERS_DB['L1'],
        text: 'Всем привет! Отличный день для закрытия матриц!',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        reactions: { '🚀': ['U67890', 'UABCDE'] }
    },
    {
        id: 'MSG002',
        user: MOCK_USERS_DB['L2'],
        text: 'Привет, Елена! Согласен, настрой боевой. Кто на каком уровне сейчас?',
        timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    },
    {
        id: 'MSG003',
        user: MOCK_USERS_DB['U67890'],
        text: 'Я на 4-м, почти закрыла. Нужно еще одно место. Кстати, кто-нибудь пробовал новый AI-генератор баннеров?',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
        id: 'MSG004',
        user: MOCK_USERS_DB['U12345'], // This is our main user
        text: 'Да, @Мария, я тестировал. Очень крутая штука, экономит кучу времени. Сделал себе пару баннеров для сторис. https://matrixflow.app/promo',
        timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
        reactions: { '👍': ['L2', 'UABCDE', 'U67890'] }
    },
    {
        id: 'MSG005',
        user: MOCK_USERS_DB['UABCDE'],
        text: 'О, надо будет тоже заценить. Спасибо за наводку!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        replyTo: {
            messageId: 'MSG004',
            userName: 'Алексей Волков',
            text: 'Да, @Мария, я тестировал. Очень крутая штука...'
        }
    },
    {
        id: 'MSG006',
        user: MOCK_USERS_DB['L2'],
        text: 'Показываю скрин своего вчерашнего дохода, чтобы всех замотивировать! 💪',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        attachment: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
        },
        reactions: { '🔥': ['U12345', 'U67890', 'L1', 'UABCDE'] }
    },
];

export const MOCK_ONLINE_USERS: OnlineUser[] = [
    { id: MOCK_TYCOON.id, name: MOCK_TYCOON.name, avatarUrl: MOCK_TYCOON.avatarUrl, level: MOCK_TYCOON.level, investors: MOCK_TYCOON.investors },
    ...Object.values(MOCK_USERS_DB),
    ...MOCK_LEADERS,
    ...MOCK_GUILD_MEMBERS
].reduce((acc: OnlineUser[], current) => {
    if (!acc.some(item => item.id === current.id)) {
        acc.push({ id: current.id, name: current.name, avatarUrl: current.avatarUrl, level: current.level, investors: (current as GuildMember).investors || 0 });
    }
    return acc;
}, []).slice(0, 15);

export const CHAT_RULES = [
    { title: 'Будьте вежливы', content: 'Относитесь ко всем участникам с уважением. Оскорбления, троллинг и разжигание конфликтов строго запрещены.' },
    { title: 'Без спама и флуда', content: 'Не отправляйте повторяющиеся сообщения. Реклама сторонних проектов, товаров или услуг запрещена.' },
    { title: 'По теме проекта', content: 'Придерживайтесь тематики проекта MatrixFlow. Делитесь успехами, задавайте вопросы, помогайте новичкам.' },
    { title: 'Конфиденциальность', content: 'Не делитесь личной информацией (телефонами, адресами, паролями) в общем чате.' },
];

// --- MOCK DATA FOR CITY MAP ---
export const MOCK_CITY_EVENT = {
    isActive: true,
    title: 'Городской Бум!',
    description: 'Все доходы от аренды увеличены на 20% на 24 часа!',
};
  
export const MOCK_CHANCE_CARD = {
    bonus: '+500 Городских Кредитов',
};

const generateProjects = (count: number, district: string, guildIds: string[], ownerId?: string) => {
    return Array.from({ length: count }, (_, i) => {
        const hasOwner = Math.random() > 0.4 || (ownerId && i === 0);
        const owner = hasOwner ? (i === 0 && ownerId ? ownerId : `U${Math.floor(Math.random() * 10000)}`) : null;
        return {
            id: `${district.substring(0, 3)}${i}`,
            ownerId: owner,
            guildId: owner ? (i === 0 && ownerId ? 'G1' : guildIds[Math.floor(Math.random() * guildIds.length)]) : null,
            upgradeLevel: (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3,
        };
    });
};

export const MOCK_CITY_DATA = {
    guilds: [
        { id: 'G1', name: 'Alphas' },
        { id: 'G2', name: 'Betas' },
        { id: 'G3', name: 'Gammas' },
    ],
    districts: [
        { id: 'D1', name: 'Жилой', projects: generateProjects(6, 'Жилой', ['G1', 'G2', 'G3'], MOCK_TYCOON.id) },
        { id: 'D2', name: 'Коммерческий', projects: generateProjects(12, 'Коммерческий', ['G1', 'G2', 'G3']) },
        { id: 'D3', name: 'Элитный', projects: generateProjects(6, 'Элитный', ['G1', 'G2', 'G3']) },
    ],
    syndicates: [
        { districtId: 'D1', guildId: 'G1' }
    ]
};
