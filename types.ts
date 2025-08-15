
export type View = 'dashboard' | 'matrix' | 'marketing' | 'leaderboard' | 'howitworks' | 'faq' | 'wallet' | 'profile' | 'team' | 'livefeed' | 'reviews' | 'support' | 'news' | 'academy' | 'promo' | 'chat' | 'landingPage';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  balance: number;
  referrals: number;
  matrixCompletions: number;
  teamEarnings?: number;
  referralLink: string;
  joinDate: string;
  welcomeMessage?: string;
  bio?: string;
  socials?: {
    telegram?: string;
    vk?: string;
    website?: string;
  };
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
    id:string;
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

export interface Review {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  rating: number; // 1 to 5
  text: string;
  timestamp: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface AcademyArticle {
  id: string;
  title: string;
  category: 'Для новичков' | 'Продвижение' | 'Маркетинг-план';
  type: 'video' | 'article';
  duration?: string; // for video
  coverUrl: string;
  isLocked: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: string;
  icon: React.ElementType;
  isCompleted: boolean;
  actionText: string;
  actionType: 'navigate' | 'copy' | 'none';
  targetView?: View;
}

export interface PromoMaterial {
  id: string;
  type: 'banner' | 'text';
  title: string;
  content: string; // URL for banner, text content for text
  size?: string; // for banner e.g., '1200x628'
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ChatMessage {
  id: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    level: number;
  };
  text: string;
  timestamp: string; // ISO 8601 format
}