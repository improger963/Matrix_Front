export type View = 'dashboard' | 'matrix' | 'marketing' | 'leaderboard' | 'howitworks' | 'faq' | 'wallet' | 'profile' | 'team' | 'livefeed';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  balance: number;
  referrals: number;
  matrixCompletions: number;
  referralLink: string;
  joinDate: string;
}

export interface MatrixNode {
  id: string;
  name: string;
  avatarUrl: string;
  isFilled: boolean;
  children?: MatrixNode[];
  joinDate?: string;
  level?: number;
  referrals?: number;
  downline?: number;
  performance?: 'hot' | 'stagnant';
  nodeType?: 'self' | 'spillover' | 'clone';
}

export interface Leader {
    id: string;
    rank: number;
    name: string;
    avatarUrl: string;
    earnings: number;
    level: number;
}

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'earning' | 'activation' | 'transfer';
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    sender?: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    recipient?: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    comment?: string;
}

export interface ProjectStats {
    totalUsers: number;
    totalEarned: number;
    usersToday: number;
    activeMatrices: number;
}

export interface TeamMember {
    id: string;
    name: string;
    avatarUrl: string;
    joinDate: string;
    level: number;
    referrals: number;
    status: 'active' | 'inactive';
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    unlocked: boolean;
    progress?: {
        current: number;
        target: number;
    };
}

export interface Notification {
    id:string;
    icon: React.ElementType;
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
}

export interface LiveFeedEvent {
  id: string;
  type: 'registration' | 'new_level' | 'withdrawal' | 'deposit' | 'matrix_close';
  user: {
    name: string;
    avatarUrl: string;
  };
  amount?: number;
  timestamp: Date;
  level?: number;
}