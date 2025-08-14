
import type { User, MatrixNode, Leader, Transaction, ProjectStats, TeamMember, Achievement, Notification } from './types';
import { Award, CheckCircle, Gift, Network, Rocket, ShieldCheck, Target, Users, UserPlus, DollarSign } from 'lucide-react';

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'T001', type: 'earning', amount: 50.00, date: '2024-07-20', status: 'completed' },
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
    joinDate: '01.06.2024'
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
    { rank: 1, name: 'Елена Максимова', avatarUrl: 'https://i.pravatar.cc/150?u=L1', earnings: 15200.50, level: 12 },
    { rank: 2, name: 'Дмитрий Громов', avatarUrl: 'https://i.pravatar.cc/150?u=L2', earnings: 11850.00, level: 10 },
    { rank: 3, name: 'Виктория Белова', avatarUrl: 'https://i.pravatar.cc/150?u=L3', earnings: 9750.25, level: 9 },
    { rank: 4, name: 'Алексей Волков', avatarUrl: 'https://i.pravatar.cc/150?u=U12345', earnings: MOCK_USER.balance, level: MOCK_USER.level },
    { rank: 5, name: 'Ирина Ковалева', avatarUrl: 'https://i.pravatar.cc/150?u=L5', earnings: 5600.00, level: 7 },
    { rank: 6, name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/150?u=L6', earnings: 4900.80, level: 6 },
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
