
import type { User, MatrixNode, Leader, Transaction, ProjectStats, TeamMember, Achievement, Notification, LiveFeedEvent, Review, NewsArticle, AcademyArticle, DailyTask, PromoMaterial, ChatMessage } from './types.ts';
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

export const MOCK_USER: User = {
    id: 'U12345',
    name: 'Алексей Волков',
    avatarUrl: 'https://i.pravatar.cc/150?u=U12345',
    level: 5,
    balance: CALCULATED_BALANCE,
    referrals: 14,
    matrixCompletions: 3,
    teamEarnings: 1250.75,
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

export const MOCK_PROJECT_STATS: ProjectStats = {
    totalUsers: 8743,
    totalEarned: 125670.50,
    usersToday: 128,
    activeMatrices: 3452,
};

// --- Утилиты для обработки данных матрицы ---

const calculateDownline = (node: MatrixNode): number => {
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

const addDownlineToNode = (node: MatrixNode): MatrixNode => {
    const newNode = { ...node };
    if (newNode.isFilled) {
        newNode.downline = calculateDownline(newNode);
    }
    if (newNode.children) {
        newNode.children = newNode.children.map(addDownlineToNode);
    }
    return newNode;
};

const RAW_MOCK_MATRIX_DATA: MatrixNode = {
    id: 'U12345',
    name: 'Алексей В.',
    avatarUrl: 'https://i.pravatar.cc/150?u=U12345',
    isFilled: true,
    nodeType: 'self',
    joinDate: '2024-06-01',
    level: 5,
    referrals: 2,
    children: [
        { 
            id: 'U67890',
            name: 'Мария С.',
            avatarUrl: 'https://i.pravatar.cc/150?u=U67890',
            isFilled: true,
            nodeType: 'spillover',
            joinDate: '2024-06-15',
            level: 4,
            referrals: 2,
            children: [
                { 
                    id: 'U11223', 
                    name: 'Иван П.', 
                    avatarUrl: 'https://i.pravatar.cc/150?u=U11223', 
                    isFilled: true,
                    performance: 'hot',
                    nodeType: 'self',
                    joinDate: '2024-07-02',
                    level: 3,
                    referrals: 2,
                    children: [
                        { id: 'UCHILD1', name: 'Петр Ф.', nodeType: 'self', avatarUrl: 'https://i.pravatar.cc/150?u=UCHILD1', isFilled: true, joinDate: '2024-07-20', level: 2, referrals: 0 },
                        { id: 'UCHILD2', name: 'Свободно', avatarUrl: '', isFilled: false }
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
                    referrals: 1,
                    children: [
                        { id: 'UCHILD3', name: 'Екатерина Б.', nodeType: 'self', avatarUrl: 'https://i.pravatar.cc/150?u=UCHILD3', isFilled: true, joinDate: '2024-07-22', level: 1, referrals: 0 },
                        { id: 'UCHILD4', name: 'Свободно', avatarUrl: '', isFilled: false }
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
            referrals: 1,
            children: [
                { 
                    id: 'UFGHIJ', 
                    name: 'Анна Л.', 
                    avatarUrl: 'https://i.pravatar.cc/150?u=UFGHIJ', 
                    isFilled: true,
                    performance: 'stagnant',
                    nodeType: 'self',
                    joinDate: '2024-07-18',
                    level: 1,
                    referrals: 0,
                     children: [
                         { id: 'UCHILD5', name: 'Свободно', avatarUrl: '', isFilled: false },
                         { id: 'UCHILD6', name: 'Свободно', avatarUrl: '', isFilled: false }
                    ]
                },
                { 
                    id: 'CLONE1',
                    name: 'Алексей В. (Клон)',
                    avatarUrl: 'https://i.pravatar.cc/150?u=U12345',
                    isFilled: true,
                    nodeType: 'clone',
                    joinDate: '2024-07-25',
                    level: 1,
                    referrals: 0,
                    children: [
                         { id: 'UCHILD7', name: 'Свободно', avatarUrl: '', isFilled: false },
                         { id: 'UCHILD8', name: 'Свободно', avatarUrl: '', isFilled: false }
                    ]
                },
            ]
        }
    ]
};

export const MOCK_MATRIX_DATA: MatrixNode = addDownlineToNode(RAW_MOCK_MATRIX_DATA);


export const MOCK_LEADERS: Leader[] = [
    { id: 'L1', rank: 1, name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1', earnings: 15200.50, level: 12 },
    { id: 'L2', rank: 2, name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2', earnings: 11850.00, level: 10 },
    { id: 'L3', rank: 3, name: 'Виктория Белова', avatarUrl: 'https://i.pravatar.cc/150?u=L3', earnings: 9750.25, level: 9 },
    { id: 'U12345', rank: 4, name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345', earnings: MOCK_USER.balance, level: MOCK_USER.level },
    { id: 'L5', rank: 5, name: 'Ирина Ковалева', avatarUrl: 'https://i.pravatar.cc/150?u=L5', earnings: 5600.00, level: 7 },
    { id: 'L6', rank: 6, name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/150?u=L6', earnings: 4900.80, level: 6 },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
    { id: 'U67890', name: 'Мария Соколова', avatarUrl: 'https://i.pravatar.cc/150?u=U67890', joinDate: '2024-06-15', level: 4, referrals: 2, status: 'active' },
    { id: 'UABCDE', name: 'Сергей Новиков', avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE', joinDate: '2024-06-20', level: 3, referrals: 1, status: 'active' },
    { id: 'REF003', name: 'Екатерина Иванова', avatarUrl: 'https://i.pravatar.cc/150?u=REF003', joinDate: '2024-06-22', level: 2, referrals: 5, status: 'active' },
    { id: 'REF004', name: 'Дмитрий Петров', avatarUrl: 'https://i.pravatar.cc/150?u=REF004', joinDate: '2024-06-25', level: 2, referrals: 0, status: 'inactive' },
    { id: 'REF005', name: 'Ольга Смирнова', avatarUrl: 'https://i.pravatar.cc/150?u=REF005', joinDate: '2024-07-01', level: 1, referrals: 3, status: 'active' },
    { id: 'REF006', name: 'Андрей Кузнецов', avatarUrl: 'https://i.pravatar.cc/150?u=REF006', joinDate: '2024-07-03', level: 1, referrals: 1, status: 'active' },
    { id: 'REF007', name: 'Ирина Васильева', avatarUrl: 'https://i.pravatar.cc/150?u=REF007', joinDate: '2024-07-05', level: 1, referrals: 0, status: 'inactive' },
    ...Array.from({ length: 7 }, (_, i) => ({
      id: `REF${i + 8}`,
      name: `Партнер ${i + 8}`,
      avatarUrl: `https://i.pravatar.cc/150?u=REF${i + 8}`,
      joinDate: `2024-07-${10 + i}`,
      level: 1,
      referrals: i % 3,
      status: i % 2 === 0 ? 'active' : 'inactive' as 'active' | 'inactive',
    })),
];


export const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: 'ach01', title: 'Добро пожаловать!', description: 'Вы успешно зарегистрировались в проекте.', icon: Rocket, unlocked: true },
    { id: 'ach02', title: 'Первые шаги', description: 'Пригласите своего первого партнера.', icon: Users, unlocked: true },
    { id: 'ach03', title: 'Командный игрок', description: 'Пригласите 10 личных партнеров.', icon: Target, unlocked: true, progress: { current: MOCK_USER.referrals, target: 10 } },
    { id: 'ach04', title: 'Закрыватель матриц', description: 'Закройте свою первую матрицу.', icon: ShieldCheck, unlocked: true },
    { id: 'ach05', title: 'Мастер матриц', description: 'Закройте 5 матриц.', icon: Award, unlocked: false, progress: { current: MOCK_USER.matrixCompletions, target: 5 } },
    { id: 'ach06', title: 'Строитель сети', description: 'Ваша команда достигла 25 человек.', icon: Network, unlocked: false, progress: { current: 18, target: 25 } },
    { id: 'ach07', title: 'Первый доход', description: 'Заработайте свои первые $100.', icon: Gift, unlocked: true },
    { id: 'ach08', title: 'Инвестор', description: 'Достигните баланса в $1000.', icon: CheckCircle, unlocked: true, progress: { current: MOCK_USER.balance, target: 1000 } },
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
    { id: 'EVT004', type: 'matrix_close', user: { name: 'Ирина К.', avatarUrl: 'https://i.pravatar.cc/150?u=L5' }, amount: 75.00, timestamp: new Date(Date.now() - 10 * 60 * 1000) },
    { id: 'EVT005', type: 'deposit', user: { name: 'Андрей С.', avatarUrl: 'https://i.pravatar.cc/150?u=L6' }, amount: 200.00, timestamp: new Date(Date.now() - 25 * 60 * 1000) },
    { id: 'EVT006', type: 'registration', user: { name: 'Ольга М.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT6' }, timestamp: new Date(Date.now() - 45 * 60 * 1000) },
    { id: 'EVT007', type: 'new_level', user: { name: 'Сергей Н.', avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE' }, level: 4, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { id: 'EVT008', type: 'registration', user: { name: 'Павел Р.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT8' }, timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000) },
    { id: 'EVT009', type: 'deposit', user: { name: 'Анна Л.', avatarUrl: 'https://i.pravatar.cc/150?u=UFGHIJ' }, amount: 50.00, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'EVT010', type: 'matrix_close', user: { name: 'Мария С.', avatarUrl: 'https://i.pravatar.cc/150?u=U67890' }, amount: 120.00, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'EVT011', type: 'withdrawal', user: { name: 'Иван П.', avatarUrl: 'https://i.pravatar.cc/150?u=U11223' }, amount: 80.00, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 'EVT012', type: 'new_level', user: { name: 'Ольга К.', avatarUrl: 'https://i.pravatar.cc/150?u=U44556' }, level: 3, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: 'EVT013', type: 'registration', user: { name: 'Кирилл В.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT13' }, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    { id: 'EVT014', type: 'deposit', user: { name: 'Светлана А.', avatarUrl: 'https://i.pravatar.cc/150?u=EVT14' }, amount: 100.00, timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000) },
    { id: 'EVT015', type: 'new_level', user: { name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1' }, level: 13, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
    { id: 'EVT016', type: 'matrix_close', user: { name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2' }, amount: 250.00, timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000) },
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
    { id: 'A001', title: 'Как пригласить первого партнера за 24 часа', category: 'Для новичков', type: 'video', duration: '12:35', coverUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false },
    { id: 'A002', title: 'Психология продаж в MLM', category: 'Продвижение', type: 'article', coverUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false },
    { id: 'A003', title: 'Разбор маркетинг-плана: все о "клонах" и "переливах"', category: 'Маркетинг-план', type: 'video', duration: '25:10', coverUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: false },
    { id: 'A004', title: 'Эффективная работа с соцсетями', category: 'Продвижение', type: 'article', coverUrl: 'https://images.unsplash.com/photo-1611162617213-6d22e4ca1c78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: true },
    { id: 'A005', title: 'Как создать личный бренд', category: 'Продвижение', type: 'video', duration: '18:05', coverUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075a6b54a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: true },
    { id: 'A006', title: 'Финансовая грамотность для участника', category: 'Для новичков', type: 'article', coverUrl: 'https://images.unsplash.com/photo-1642792962358-83132a2e475c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', isLocked: true },
];

export const MARKETING_GENIUS_TASK_ID = 'D02';

export const MOCK_ALL_TASKS: DailyTask[] = [
    // Onboarding Tasks
    { id: 'O01', category: 'onboarding', title: 'Заполнить профиль', description: 'Добавьте информацию о себе и аватар.', reward: '+50 очков', icon: Edit3, isCompleted: true, actionText: 'В профиль', actionType: 'navigate', target: 'profile' },
    { id: 'O02', category: 'onboarding', title: 'Изучить "Как это работает"', description: 'Поймите основы маркетинга проекта.', reward: '+25 очков', icon: GraduationCap, isCompleted: true, actionText: 'Читать', actionType: 'navigate', target: 'howitworks' },
    { id: 'O03', category: 'onboarding', title: 'Первое сообщение в чате', description: 'Поприветствуйте других участников в общем чате.', reward: '+15 очков', icon: MessageSquare, isCompleted: false, actionText: 'Перейти в чат', actionType: 'navigate', target: 'chat' },

    // Daily Tasks
    { id: 'D01', category: 'daily', title: 'Войти в аккаунт', description: 'Ежедневный вход для поддержания активности.', reward: '+5 очков', icon: ListTodo, isCompleted: true, actionText: 'Выполнено', actionType: 'none' },
    { id: MARKETING_GENIUS_TASK_ID, category: 'daily', title: 'Сгенерировать пост', description: 'Используйте AI-Копирайтер для создания контента.', reward: '+15 очков', icon: BotMessageSquare, isCompleted: false, actionText: 'К AI-Копирайтеру', actionType: 'navigate', target: 'marketing' },
    { id: 'D03', category: 'daily', title: 'Поделиться ссылкой', description: 'Поделитесь реферальной ссылкой в любой соцсети.', reward: '+25 очков', icon: Share2, isCompleted: false, actionText: 'Скопировать ссылку', actionType: 'copy' },
    
    // Special Tasks
    { id: 'S01', category: 'special', title: 'Марафон "Новичок"', description: 'Пригласите 3-х партнеров за первую неделю.', reward: '+$50 на баланс', icon: Rocket, isCompleted: false, actionText: 'Подробнее', actionType: 'none', progress: { current: 1, target: 3 } },
    { id: 'S02', category: 'special', title: 'Оставить отзыв', description: 'Поделитесь своим мнением о проекте и получите бонус.', reward: '+100 очков', icon: Star, isCompleted: false, actionText: 'Оставить отзыв', actionType: 'navigate', target: 'reviews' },
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

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    {
        id: 'MSG001',
        user: MOCK_USERS_DB['L1'],
        text: 'Всем привет! Отличный день для закрытия матриц!',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
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
        text: 'Да, я тестировал. Очень крутая штука, экономит кучу времени. Сделал себе пару баннеров для сторис.',
        timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    },
    {
        id: 'MSG005',
        user: MOCK_USERS_DB['UABCDE'],
        text: 'О, надо будет тоже заценить. Спасибо за наводку!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
];