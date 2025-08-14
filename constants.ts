import type { User, MatrixNode, Leader, Transaction, ProjectStats, TeamMember, Achievement, Notification, LiveFeedEvent, Review, NewsArticle } from './types';
import { Award, CheckCircle, Gift, Network, Rocket, ShieldCheck, Target, Users, UserPlus, DollarSign, Share2 } from 'lucide-react';

export const MOCK_USERS_DB: { [id: string]: Pick<User, 'id' | 'name' | 'avatarUrl'> } = {
  'U12345': { id: 'U12345', name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345' },
  'U67890': { id: 'U67890', name: 'Мария Соколова', avatarUrl: 'https://i.pravatar.cc/150?u=U67890' },
  'UABCDE': { id: 'UABCDE', name: 'Сергей Новиков', avatarUrl: 'https://i.pravatar.cc/150?u=UABCDE' },
  'L1': { id: 'L1', name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1' },
  'L2': { id: 'L2', name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2' },
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
    referralLink: 'https://matrixflow.app/join?ref=U12345',
    joinDate: '2024-06-01'
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
    { id: 'ach03', title: 'Командный игрок', description: 'Пригласите 10 личных партнеров.', icon: Target, unlocked: false, progress: { current: MOCK_USER.referrals, target: 10 } },
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
