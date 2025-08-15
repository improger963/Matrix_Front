
import axios from 'axios';
import type { 
    Partner, 
    Project, 
    Transaction, 
    Leader, 
    MarketStats, 
    Mission, 
    ChatMessage, 
    LiveFeedEvent
} from '../types.ts';
import {
    MOCK_PARTNER,
    MOCK_PROJECTS,
    MOCK_TRANSACTIONS,
    MOCK_LEADERS,
    MOCK_MARKET_STATS,
    MOCK_MISSIONS,
    MOCK_CHAT_MESSAGES,
    MOCK_NETWORK_MEMBERS,
    MOCK_USERS_DB,
    MOCK_LIVE_FEED_EVENTS,
} from '../constants.ts';

// --- 1. Архитектура и Настройка ---

// Настроенный инстанс axios для будущего использования
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// В будущем здесь можно добавить interceptor для JWT токенов
// apiClient.interceptors.request.use(config => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// Утилита для симуляции задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const SIMULATED_DELAY = 400;

// Локальное хранилище для симуляции изменений данных
let localPartnerData: Partner = JSON.parse(JSON.stringify(MOCK_PARTNER));
let localProjects: Project[] = JSON.parse(JSON.stringify(MOCK_PROJECTS));
let localMissions: Mission[] = JSON.parse(JSON.stringify(MOCK_MISSIONS));
let localTransactions: Transaction[] = JSON.parse(JSON.stringify(MOCK_TRANSACTIONS));

// --- 2. Реализация симуляции REST API ---

// --- Partners ---
export const getMyPartnerData = async (): Promise<Partner> => {
    console.log("FETCH: GET /api/partners/me");
    await delay(SIMULATED_DELAY);
    return Promise.resolve(localPartnerData);
};

export const updateMyPartnerData = async (data: Partial<Partner>): Promise<Partner> => {
    console.log("FETCH: PUT /api/partners/me", data);
    await delay(SIMULATED_DELAY);
    localPartnerData = { ...localPartnerData, ...data };
    return Promise.resolve(localPartnerData);
};

export const getPublicPartnerData = async (id: string): Promise<Partial<Partner>> => {
    console.log(`FETCH: GET /api/partners/${id}`);
    await delay(SIMULATED_DELAY);
    const user = MOCK_USERS_DB[id] || MOCK_NETWORK_MEMBERS.find(m => m.id === id);
    if (user) {
        const { name, avatarUrl, level, rank, partners, fundingCompleted } = user;
        return Promise.resolve({ name, avatarUrl, level, rank, partners, fundingCompleted });
    }
    return Promise.reject(new Error("Partner not found"));
};

export const getMyNetwork = async (): Promise<Partner[]> => {
    console.log("FETCH: GET /api/partners/me/network");
    await delay(SIMULATED_DELAY);
    return Promise.resolve(MOCK_NETWORK_MEMBERS);
};

// --- Projects ---
export const getMyProjects = async (): Promise<Project[]> => {
    console.log("FETCH: GET /api/projects");
    await delay(SIMULATED_DELAY);
    return Promise.resolve(localProjects);
};

export const activateProject = async (id: string): Promise<Project[]> => {
    console.log(`FETCH: POST /api/projects/${id}/activate`);
    await delay(SIMULATED_DELAY);
    const projectToActivate = localProjects.find(p => p.id === id);
    if (projectToActivate && localPartnerData.capital >= projectToActivate.entryCost) {
        localPartnerData.capital -= projectToActivate.entryCost;
        localProjects = localProjects.map(p => ({ ...p, isActive: p.id === id }));
        return Promise.resolve(localProjects);
    }
    if (projectToActivate && localPartnerData.capital < projectToActivate.entryCost) {
        return Promise.reject(new Error("Insufficient funds"));
    }
    return Promise.reject(new Error("Project not found"));
};

// --- Transactions ---
export const getTransactionHistory = async (page: number, limit: number): Promise<{ transactions: Transaction[], total: number }> => {
    console.log(`FETCH: GET /api/transactions?page=${page}&limit=${limit}`);
    await delay(SIMULATED_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    return Promise.resolve({
        transactions: localTransactions.slice(start, end),
        total: localTransactions.length,
    });
};

export const createDeposit = async (amount: number): Promise<{ address: string, qrCode: string }> => {
    console.log(`FETCH: POST /api/transactions/deposit`, { amount });
    await delay(SIMULATED_DELAY);
    const mockAddress = "TXYZ123abcdeFGHIJKLMNopqrstuvwxyz789";
    return Promise.resolve({
        address: mockAddress,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${mockAddress}`
    });
};

export const createWithdrawal = async (amount: number, address: string): Promise<{ success: boolean }> => {
    console.log(`FETCH: POST /api/transactions/withdraw`, { amount, address });
    await delay(SIMULATED_DELAY);
    if (localPartnerData.capital >= amount) {
        localPartnerData.capital -= amount;
        return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Insufficient funds"));
};

export const transferCapital = async (recipientId: string, amount: number, comment?: string): Promise<Transaction> => {
    console.log(`FETCH: POST /api/transactions/transfer`, { recipientId, amount, comment });
    await delay(SIMULATED_DELAY);
    const recipient = MOCK_USERS_DB[recipientId];
    if (!recipient) {
        return Promise.reject(new Error("Recipient not found"));
    }
    if (localPartnerData.capital < amount) {
        return Promise.reject(new Error("Insufficient funds"));
    }
    
    localPartnerData.capital -= amount;
    
    const newTransaction: Transaction = {
        id: `T${Date.now()}`,
        type: 'transfer',
        amount: -amount,
        date: new Date().toISOString(),
        status: 'completed',
        sender: { id: localPartnerData.id, name: localPartnerData.name, avatarUrl: localPartnerData.avatarUrl },
        recipient: { id: recipient.id, name: recipient.name, avatarUrl: recipient.avatarUrl },
        comment
    };
    localTransactions.unshift(newTransaction);
    
    return Promise.resolve(newTransaction);
};

// --- AI ---
export const generateAIContent = async (prompt: string): Promise<string> => {
    console.log(`FETCH: POST /api/ai/generate-content`, { prompt });
    await delay(1500);
    return Promise.resolve(`**AI-сгенерированный ответ на ваш запрос:**\n\n"${prompt}"\n\n- Уникальные инвестиционные Проекты.\n- Мощная Бизнес-сеть и поддержка.\n- Начните строить свою империю уже сегодня в **Nexus Capital**!`);
};

export const generateAIImage = async (prompt: string): Promise<string> => {
    console.log(`FETCH: POST /api/ai/generate-image`, { prompt });
    await delay(3000);
    // Returning a placeholder image URL
    return Promise.resolve(`https://images.unsplash.com/photo-1634495589021-4e94113110e5?q=80&w=800`);
};

export const getAINetworkAnalysis = async (): Promise<string> => {
    console.log(`FETCH: GET /api/ai/analyze-network`);
    await delay(2000);
    return Promise.resolve(`**Отчет AI-Аналитика по вашей Бизнес-сети:**\n\n*   **Активность:** 75% ваших партнеров активны. Это хороший показатель!\n*   **Лидер:** Мария Соколова — ваш лучший рекрутер.\n*   **Рекомендация:** Создайте в AI-Ассистенте мотивирующее сообщение для неактивных партнеров.`);
};

// --- Прочее ---
export const getLeaderboard = async (): Promise<Leader[]> => {
    console.log("FETCH: GET /api/leaderboard");
    await delay(SIMULATED_DELAY);
    return Promise.resolve(MOCK_LEADERS);
};

export const getMarketStats = async (): Promise<MarketStats> => {
    console.log("FETCH: GET /api/stats/market");
    await delay(SIMULATED_DELAY);
    return Promise.resolve(MOCK_MARKET_STATS);
};

export const getMissions = async (): Promise<Mission[]> => {
    console.log("FETCH: GET /api/missions");
    await delay(SIMULATED_DELAY);
    return Promise.resolve(localMissions);
};

export const claimMissionReward = async (id: string): Promise<{ updatedMissions: Mission[], reward: { cap: number, rp: number } }> => {
    console.log(`FETCH: POST /api/missions/${id}/claim`);
    await delay(SIMULATED_DELAY);
    const mission = localMissions.find(m => m.id === id);
    if (mission && mission.status === 'completed') {
        mission.status = 'claimed';
        const reward = { cap: mission.rewardCAP || 0, rp: mission.rewardRP };
        localPartnerData.capital += reward.cap;
        localPartnerData.reputation += reward.rp;
        return Promise.resolve({ updatedMissions: localMissions, reward });
    }
    return Promise.reject(new Error("Mission not found or not completed"));
};

export const getChatMessages = async (): Promise<ChatMessage[]> => {
    console.log("FETCH: GET /api/chat/messages");
    await delay(SIMULATED_DELAY);
    return Promise.resolve(MOCK_CHAT_MESSAGES);
};

// --- 3. Реализация симуляции WebSocket API ---

type WebSocketCallback = (data: any) => void;

export const WebSocketService = {
    _isConnected: false,
    _intervalId: null as NodeJS.Timeout | null,
    _subscribers: {} as Record<string, WebSocketCallback[]>,

    connect(token: string): void {
        if (this._isConnected || !token) {
            console.log("WebSocket: Already connected or no token provided.");
            return;
        }
        console.log("WebSocket: Connecting with token:", token);
        this._isConnected = true;

        this._intervalId = setInterval(() => {
            // Симуляция случайного события "feed_update"
            const randomEvent: LiveFeedEvent = MOCK_LIVE_FEED_EVENTS[Math.floor(Math.random() * MOCK_LIVE_FEED_EVENTS.length)];
            const eventPayload = { ...randomEvent, id: `EVT${Date.now()}`, timestamp: new Date() };
            
            const eventData = {
                event: 'feed_update',
                payload: eventPayload
            };

            console.log("WebSocket: Server -> Client", eventData);
            this._publish('feed_update', eventPayload);

        }, 5000); // Генерировать событие каждые 5 секунд
    },

    disconnect(): void {
        console.log("WebSocket: Disconnecting.");
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._isConnected = false;
        this._intervalId = null;
        this._subscribers = {};
    },

    on(event: string, callback: WebSocketCallback): void {
        if (!this._subscribers[event]) {
            this._subscribers[event] = [];
        }
        this._subscribers[event].push(callback);
        console.log(`WebSocket: New subscriber for event "${event}"`);
    },
    
    off(event: string, callback: WebSocketCallback): void {
        if (this._subscribers[event]) {
            this._subscribers[event] = this._subscribers[event].filter(cb => cb !== callback);
        }
    },

    emit(event: string, data: any): void {
        if (!this._isConnected) {
            console.error("WebSocket: Cannot emit, not connected.");
            return;
        }
        console.log("WebSocket: Client -> Server", { event, data });
        // Симуляция ответа от сервера, например, для чата
        if (event === 'chat_message') {
            setTimeout(() => {
                const ackData = { status: 'ok', messageId: data.id || `MSG${Date.now()}` };
                console.log("WebSocket: Server -> Client (ack)", { event: 'chat_message_ack', payload: ackData });
                this._publish('chat_message_ack', ackData);
            }, 200);
        }
    },

    _publish(event: string, data: any): void {
        if (this._subscribers[event]) {
            this._subscribers[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`WebSocket: Error in subscriber for event "${event}"`, error);
                }
            });
        }
    }
};

const apiService = {
    getMyPartnerData,
    updateMyPartnerData,
    getPublicPartnerData,
    getMyNetwork,
    getMyProjects,
    activateProject,
    getTransactionHistory,
    createDeposit,
    createWithdrawal,
    transferCapital,
    generateAIContent,
    generateAIImage,
    getAINetworkAnalysis,
    getLeaderboard,
    getMarketStats,
    getMissions,
    claimMissionReward,
    getChatMessages,
};

export default apiService;
