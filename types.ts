

export type View = 'dashboard' | 'market' | 'startup' | 'leaderboard' | 'howitworks' | 'faq' | 'capital' | 'profile' | 'syndicate' | 'livefeed' | 'reviews' | 'support' | 'news' | 'academy' | 'promo' | 'chat' | 'landingPage' | 'tasks' | 'boardroom';

export interface Partner {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  capital: number;
  xp: number;
  investors: number;
  exitsCompleted: number;
  syndicateProfit?: number;
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
  syndicateId?: string;
}

export interface StartupNode {
  id: string;
  name: string;
  avatarUrl: string;
  isFilled: boolean;
  children?: StartupNode[];
  joinDate?: string;
  level?: number;
  investors?: number;
  downline?: number;
  nodeType?: 'self' | 'syndicate_deal' | 'spinoff'; // self: 'Инвестор', syndicate_deal: 'Сделка из синдиката', spinoff: 'Спин-офф'
  lastActivityDate?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  fundingStage: 1 | 2 | 3; // 1: Pre-seed, 2: Round A, 3: Round B
  industry: string;
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
    type: 'deposit' | 'withdrawal' | 'profit' | 'investment' | 'transfer' | 'upgrade' | 'syndicate_profit'; // 'profit': 'Прибыль'
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
    activeStartups: number;
}

export interface SyndicateMember {
    id: string;
    name: string;
    avatarUrl: string;
    joinDate: string;
    level: number;
    investors: number;
    status: 'active' | 'inactive';
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    unlocked: boolean;
    category: 'Syndicate' | 'Financial' | 'Personal' | 'Milestone';
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
  type: 'registration' | 'new_level' | 'withdrawal' | 'deposit' | 'startup_exit' | 'upgrade';
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
  xpReward: number;
  isCompleted: boolean;
  linkedMissionId?: string;
}

export interface DailyTask {
  id:string;
  title: string;
  subtitle?: string;
  description: string;
  reward: number; // XP points
  icon: React.ElementType;
  isCompleted: boolean;
  actionText: string;
  actionType: 'navigate' | 'copy' | 'external_link' | 'none' | 'open_assistant';
  target?: View | string;
  category: 'onboarding' | 'daily' | 'special' | 'mission';
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
  investors?: number;
}

export interface SyndicateGoal {
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
