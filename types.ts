
export type View = 'dashboard' | 'market' | 'project' | 'leaderboard' | 'howitworks' | 'faq' | 'assets' | 'profile' | 'network' | 'livefeed' | 'reviews' | 'support' | 'news' | 'academy' | 'promo' | 'chat' | 'landingPage' | 'tasks' | 'boardroom' | 'achievements';

export type CareerRank = 'Стажер' | 'Аналитик' | 'Партнер' | 'Старший Партнер' | 'Директор';

export interface Partner {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  capital: number;
  reputation: number; // XP is now Reputation (RP)
  rank: CareerRank;
  partners: number; // Renamed from investors
  fundingCompleted: number; // Renamed from exitsCompleted
  networkProfit?: number; // Renamed from syndicateProfit
  referralLink: string;
  joinDate: string;
  welcomeMessage?: string;
  bio?: string;
  socials?: {
    telegram?: string;
    linkedin?: string;
    website?: string;
    vk?: string;
  };
  networkId?: string; // Renamed from syndicateId
  status?: 'active' | 'inactive';
}

// Represents a project the user is managing (e.g., Pre-seed, Series A)
export interface Project {
  id: string;
  type: 'Pre-seed' | 'Series A' | 'IPO Stage';
  entryCost: number;
  totalShares: number;
  sharesSold: number;
  isActive: boolean;
  milestones: { shares: number, label: string }[];
}


export interface Leader {
    id: string;
    rank: number;
    name: string;
    avatarUrl: string;
    earnings: number;
    level: number;
    careerRank: CareerRank;
}

export interface Transaction {
    id:string;
    type: 'deposit' | 'withdrawal' | 'profit' | 'investment' | 'transfer' | 'upgrade' | 'network_profit';
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

export interface MarketStats {
    totalPartners: number;
    totalProfit: number;
    newPartnersToday: number;
    activeProjects: number;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    unlocked: boolean;
    category: 'Карьера' | 'Финансы' | 'Лидерство' | 'Стратегия';
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
    type: 'proactive_tip' | 'standard';
}

export interface LiveFeedEvent {
  id: string;
  type: 'registration' | 'new_level' | 'withdrawal' | 'deposit' | 'funding_completed' | 'upgrade';
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
  category: 'Для новичков' | 'Масштабирование' | 'Стратегия';
  type: 'video' | 'article';
  duration?: string; // for video
  coverUrl: string;
  isLocked: boolean;
  content: string;
  rewardRP: number; // Renamed from xpReward
  isCompleted: boolean;
  linkedMissionId?: string;
}

export interface Mission {
  id:string;
  title: string;
  description: string;
  rewardRP: number;
  rewardCAP?: number;
  icon: React.ElementType;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'claimed';
  actionText: string;
  actionType: 'navigate' | 'copy' | 'external_link' | 'none' | 'open_assistant';
  target?: View | string;
  category: 'Путь Партнера' | 'Ежедневные Брифинги' | 'Еженедельные Контракты';
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
  type: 'user' | 'announcement' | 'poll';
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    level: number;
    rank: CareerRank;
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
  pollOptions?: {
      id: string;
      text: string;
      voters: string[];
  }[];
}

export interface OnlineUser {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  partners?: number;
  rank: CareerRank;
}

export interface NetworkGoal {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    deadline: string;
    reward: string;
}

export interface BoardroomMember extends Leader {
    influence: number; // e.g. voting power
}

export interface BoardroomVote {
    id: string;
    title: string;
    description: string;
    options: {
        id: string;
        text: string;
        votes: number;
    }[];
    totalVotes: number;
    endsAt: string;
    userVote?: string; // option id
}

// Navigation type definitions
export interface NavItem {
    type: 'item';
    id: View;
    label: string;
    icon: React.ElementType;
}

export interface NavGroup {
    type: 'group';
    title: string;
    icon: React.ElementType;
    items: NavItem[];
}