

export type View = 'dashboard' | 'cityMap' | 'project' | 'marketing' | 'leaderboard' | 'howitworks' | 'faq' | 'bank' | 'profile' | 'guild' | 'livefeed' | 'reviews' | 'support' | 'news' | 'academy' | 'promo' | 'chat' | 'landingPage' | 'tasks';

export interface Tycoon {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  cityCredits: number;
  xp: number;
  investors: number; // Renamed from referrals
  projectsCompleted: number; // Renamed from matrixCompletions
  guildEarnings?: number; // Renamed from teamEarnings
  referralLink: string;
  joinDate: string;
  welcomeMessage?: string;
  bio?: string;
  socials?: {
    telegram?: string;
    vk?: string;
    website?: string;
  };
  guildId?: string;
}

export interface ProjectNode {
  id: string;
  name: string;
  avatarUrl: string;
  isFilled: boolean;
  children?: ProjectNode[];
  joinDate?: string;
  level?: number;
  investors?: number;
  downline?: number;
  nodeType?: 'self' | 'spillover' | 'clone'; // self is 'Инвестор', spillover is 'Городской контракт', clone is 'Филиал'
  lastActivityDate?: string;
  branchHealth?: 'healthy' | 'sleeping' | 'problematic';
  // Game-specific properties
  upgradeLevel: 1 | 2 | 3; // 1: Участок, 2: Дома, 3: Отель
  district: string;
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
    type: 'deposit' | 'withdrawal' | 'earning' | 'activation' | 'transfer' | 'upgrade'; // 'earning' is 'Арендная плата'
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

export interface MetropolisStats {
    totalTycoons: number;
    totalEarned: number;
    tycoonsToday: number;
    activeProjects: number;
}

export interface GuildMember {
    id: string;
    name: string;
    avatarUrl: string;
    joinDate: string;
    level: number;
    investors: number; // Renamed from referrals
    status: 'active' | 'inactive';
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    unlocked: boolean;
    category: 'Guild' | 'Financial' | 'Personal' | 'Milestone'; // Renamed Team to Guild
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
  type: 'registration' | 'new_level' | 'withdrawal' | 'deposit' | 'project_close'; // Renamed from matrix_close
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
  category: 'Для новичков' | 'Продвижение' | 'Бизнес-план'; // Renamed
  type: 'video' | 'article';
  duration?: string; // for video
  coverUrl: string;
  isLocked: boolean;
  content: string;
  xpReward: number;
  isCompleted: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  reward: number; // XP points
  icon: React.ElementType;
  isCompleted: boolean;
  actionText: string;
  actionType: 'navigate' | 'copy' | 'external_link' | 'none';
  target?: View | string;
  category: 'onboarding' | 'daily' | 'special';
  progress?: { current: number; target: number };
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
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user IDs
  replyTo?: {
    messageId: string;
    userName: string;
    text: string;
  };
  attachment?: {
    type: 'image';
    url: string;
  };
}

export interface OnlineUser {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  investors?: number;
}
