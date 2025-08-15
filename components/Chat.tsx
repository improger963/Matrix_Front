

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, Smile, Paperclip, X, MessageSquareReply, Pin, User, Users, Search, BookOpen, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { MOCK_CHAT_MESSAGES, MOCK_ONLINE_USERS, CHAT_RULES, PINNED_CHAT_MESSAGE } from '../constants.ts';
import type { ChatMessage, OnlineUser } from '../types.ts';
import Button from './ui/Button.tsx';

// --- STYLING HELPERS ---
const getLevelColor = (level: number): string => {
    if (level >= 10) return 'text-yellow-300 font-bold';
    if (level >= 7) return 'text-purple-400 font-semibold';
    if (level >= 4) return 'text-cyan-400 font-semibold';
    return 'text-white font-medium';
};
const shineEffect = (level: number): React.CSSProperties => {
    if (level >= 10) return { textShadow: '0 0 8px rgba(250, 204, 21, 0.7)' };
    return {};
};

// --- UTILITY & FORMATTING ---
const processMessageText = (text: string) => {
    const parts = text.split(/(@\w+|https?:\/\/[^\s]+)/g);
    return parts.map((part, i) => {
        if (part.startsWith('@')) {
            return <span key={i} className="bg-brand-primary/50 text-white font-bold rounded px-1 py-0.5">{part}</span>;
        }
        if (part.startsWith('http')) {
            return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">{part}</a>;
        }
        return part;
    });
};
const formatChatTime = (isoString: string) => new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};
const popularEmojis = ['😀', '😂', '👍', '🔥', '🚀', '💰', '🎉', '🙏', '💪', '🤝'];

// --- SUB-COMPONENTS ---
const TypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 p-2">
        <img src="https://i.pravatar.cc/150?u=L2" alt="typing" className="h-8 w-8 rounded-full" />
        <div className="bg-dark-700 p-3 rounded-2xl rounded-bl-lg">
            <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-typing-bubble [animation-delay:0s]"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-typing-bubble [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-typing-bubble [animation-delay:0.4s]"></span>
            </div>
        </div>
    </div>
);

const ReplyPreview: React.FC<{ message: ChatMessage; onCancel: () => void }> = ({ message, onCancel }) => (
    <div className="flex items-center justify-between p-2 pl-4 bg-dark-900/70 border-t border-b border-dark-700/50">
        <div className="text-xs text-left overflow-hidden">
            <p className="text-brand-accent">Ответ для {message.user.name}</p>
            <p className="text-gray-400 truncate">{message.text}</p>
        </div>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
    </div>
);

const PinnedMessage: React.FC<{ message: ChatMessage; onDismiss: () => void }> = ({ message, onDismiss }) => (
    <div className="flex items-start gap-3 p-3 bg-dark-700/50 border-b border-dark-600 animate-fade-in flex-shrink-0">
        <Pin className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
        <div className="text-xs flex-1">
            <p className="font-semibold text-yellow-400">Закрепленное сообщение</p>
            <p className="text-gray-300 truncate">{message.text}</p>
        </div>
        <button onClick={onDismiss} className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-dark-600"><X className="h-4 w-4" /></button>
    </div>
);

const UserProfileModal: React.FC<{ user: OnlineUser; onClose: () => void }> = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-dark-800 border border-dark-700 rounded-xl shadow-lg w-full max-w-sm animate-pop-in p-6 text-center" onClick={e => e.stopPropagation()}>
            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto border-4 border-brand-primary mb-4" />
            <h3 className={`${getLevelColor(user.level)} text-xl`} style={shineEffect(user.level)}>{user.name}</h3>
            <p className="text-gray-500 text-sm">ID: {user.id}</p>
            <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-dark-700 p-3 rounded-lg"><p className="text-xs text-gray-400">Уровень</p><p className="text-lg font-bold text-white">{user.level}</p></div>
                <div className="bg-dark-700 p-3 rounded-lg"><p className="text-xs text-gray-400">Инвесторы</p><p className="text-lg font-bold text-white">{user.investors ?? 'N/A'}</p></div>
            </div>
            <Button className="w-full" variant="secondary">Перейти в профиль</Button>
        </div>
    </div>
);

const MessageBubble: React.FC<{ message: ChatMessage; isStartOfGroup: boolean; onReply: (msg: ChatMessage) => void; onReact: (msg: ChatMessage, emoji: string) => void; onUserClick: (user: OnlineUser) => void; }> = React.memo(({ message, isStartOfGroup, onReply, onReact, onUserClick }) => {
    const { user: currentUser } = useAppContext();
    const isCurrentUser = message.user.id === currentUser.id;
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    return (
        <div className={`flex items-start gap-2 group animate-message-in ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isStartOfGroup ? 'mt-3' : 'mt-1'}`}>
            {!isCurrentUser && (
                <div className="w-8 flex-shrink-0">
                    {isStartOfGroup && <img src={message.user.avatarUrl} alt={message.user.name} className="h-8 w-8 rounded-full cursor-pointer" onClick={() => onUserClick(message.user)} />}
                </div>
            )}
            <div className={`relative max-w-xs md:max-w-md`}>
                <div className={`absolute top-2 z-20 ${isCurrentUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} hidden group-hover:flex items-center bg-dark-900 border border-dark-700 rounded-full shadow-lg`}>
                    <div className="relative">
                        <button onClick={() => setShowReactionPicker(p => !p)} className="p-2 hover:bg-dark-700 rounded-l-full"><Smile className="h-4 w-4" /></button>
                        {showReactionPicker && (
                            <div className="absolute bottom-full mb-2 bg-dark-700 p-2 rounded-lg shadow-xl grid grid-cols-5 gap-1" onMouseLeave={() => setShowReactionPicker(false)}>
                                {popularEmojis.map(emoji => <button type="button" key={emoji} onClick={() => { onReact(message, emoji); setShowReactionPicker(false); }} className="p-1 text-2xl rounded-md hover:bg-dark-600 transition-colors">{emoji}</button>)}
                            </div>
                        )}
                    </div>
                    <button onClick={() => onReply(message)} className="p-2 hover:bg-dark-700"><MessageSquareReply className="h-4 w-4" /></button>
                    <button className="p-2 hover:bg-dark-700 rounded-r-full"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
                <div className={`p-2 px-3 rounded-2xl ${isCurrentUser ? 'bg-gradient-to-br from-brand-primary to-purple-700 text-white rounded-br-none' : 'bg-dark-700 text-gray-200 rounded-bl-none'}`}>
                    {isStartOfGroup && !isCurrentUser && <p className={`${getLevelColor(message.user.level)} text-sm mb-1 cursor-pointer`} style={shineEffect(message.user.level)} onClick={() => onUserClick(message.user)}>{message.user.name}</p>}
                    {message.replyTo && (
                        <div className="p-2 mb-2 bg-black/20 border-l-2 border-brand-accent rounded">
                            <p className="font-bold text-xs">{message.replyTo.userName}</p>
                            <p className="text-xs opacity-80 truncate">{message.replyTo.text}</p>
                        </div>
                    )}
                    {message.attachment?.type === 'image' && <img src={message.attachment.url} alt="attachment" className="rounded-lg mb-2 max-h-48" />}
                    <p className="text-sm break-words whitespace-pre-wrap">{processMessageText(message.text)}</p>
                    <p className={`text-[10px] mt-1 ${isCurrentUser ? 'text-purple-200/80' : 'text-gray-500'} text-right`}>{formatChatTime(message.timestamp)}</p>
                </div>
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className={`absolute -bottom-3 flex gap-1 ${isCurrentUser ? 'right-2' : 'left-2'}`}>
                        {Object.entries(message.reactions).map(([emoji, userIds]) => (
                            <button key={emoji} onClick={() => onReact(message, emoji)} className={`flex items-center text-xs bg-dark-900 border rounded-full px-2 py-0.5 shadow-md ${userIds.includes(currentUser.id) ? 'border-brand-primary' : 'border-dark-600 hover:border-brand-accent'}`}>
                                <span>{emoji}</span>
                                <span className="ml-1 font-semibold">{userIds.length}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

const RuleItem: React.FC<{ rule: { title: string; content: string } }> = ({ rule }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-dark-700/50">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left p-3 hover:bg-dark-700/30">
                <h4 className="font-semibold text-white text-sm">{rule.title}</h4>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 p-3 pt-0">{rule.content}</p>
                </div>
            </div>
        </div>
    );
};

const ChatSidebar: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUserClick: (user: OnlineUser) => void;
}> = ({ isOpen, onClose, onUserClick }) => {
    const [activeTab, setActiveTab] = useState<'users' | 'rules'>('users');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() =>
        MOCK_ONLINE_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())),
        [searchQuery]
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 border-l border-dark-700/50 flex-col flex-shrink-0 hidden lg:flex">
                <div className="flex p-2 bg-dark-900/30 border-b border-dark-700/50">
                    <button onClick={() => setActiveTab('users')} className={`flex-1 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-dark-700 text-white' : 'text-gray-400 hover:bg-dark-700/50'}`}><Users className="h-4 w-4"/>Участники</button>
                    <button onClick={() => setActiveTab('rules')} className={`flex-1 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 ${activeTab === 'rules' ? 'bg-dark-700 text-white' : 'text-gray-400 hover:bg-dark-700/50'}`}><BookOpen className="h-4 w-4"/>Правила</button>
                </div>
                {activeTab === 'users' ? (
                    <div className="flex flex-col flex-1 min-h-0">
                        <div className="p-3 border-b border-dark-700/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск..." className="w-full bg-dark-900/50 border border-dark-600 rounded-md pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"/>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredUsers.map(u => (
                                <div key={u.id} onClick={() => onUserClick(u)} className="flex items-center gap-3 p-2 rounded-md hover:bg-dark-700/50 cursor-pointer">
                                    <img src={u.avatarUrl} alt={u.name} className="h-8 w-8 rounded-full" />
                                    <div>
                                        <p className={`${getLevelColor(u.level)} text-sm`}>{u.name}</p>
                                        <p className="text-xs text-gray-500">Уровень {u.level}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {CHAT_RULES.map(rule => <RuleItem key={rule.title} rule={rule} />)}
                    </div>
                )}
            </aside>
            {/* Mobile Drawer */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-dark-800 border-l border-dark-700 shadow-2xl z-40 transform transition-transform lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="flex justify-between items-center p-4 border-b border-dark-700/50">
                    <h3 className="font-bold text-white">Информация</h3>
                    <button onClick={onClose}><X className="h-5 w-5"/></button>
                 </div>
                 <div className="flex p-2 bg-dark-900/30 border-b border-dark-700/50">
                    <button onClick={() => setActiveTab('users')} className={`flex-1 py-2 text-sm font-semibold rounded-md ${activeTab === 'users' ? 'bg-dark-700 text-white' : 'text-gray-400'}`}><Users className="h-4 w-4 inline mr-1"/>Участники</button>
                    <button onClick={() => setActiveTab('rules')} className={`flex-1 py-2 text-sm font-semibold rounded-md ${activeTab === 'rules' ? 'bg-dark-700 text-white' : 'text-gray-400'}`}><BookOpen className="h-4 w-4 inline mr-1"/>Правила</button>
                </div>
                 {activeTab === 'users' ? (
                    <div className="flex flex-col h-[calc(100%-120px)]">
                        <div className="p-3 border-b border-dark-700/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск..." className="w-full bg-dark-900/50 border border-dark-600 rounded-md pl-9 pr-3 py-1.5 text-sm"/>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredUsers.map(u => (
                                <div key={u.id} onClick={() => { onUserClick(u); onClose(); }} className="flex items-center gap-3 p-2 rounded-md hover:bg-dark-700/50 cursor-pointer">
                                    <img src={u.avatarUrl} alt={u.name} className="h-8 w-8 rounded-full" />
                                    <div>
                                        <p className={`${getLevelColor(u.level)} text-sm`}>{u.name}</p>
                                        <p className="text-xs text-gray-500">Уровень {u.level}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {CHAT_RULES.map(rule => <RuleItem key={rule.title} rule={rule} />)}
                    </div>
                )}
            </div>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose}></div>}
        </>
    );
};


// --- MAIN CHAT COMPONENT ---
const Chat: React.FC = () => {
    const { user } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showPinned, setShowPinned] = useState(true);
    const [viewingUser, setViewingUser] = useState<OnlineUser | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
        if(chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior });
        }
    }, []);

    useEffect(() => { scrollToBottom('auto'); }, []);
    useEffect(() => {
        const input = messageInputRef.current;
        if (input) {
            input.style.height = 'auto';
            input.style.height = `${Math.min(input.scrollHeight, 128)}px`;
        }
    }, [newMessage]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageToSend: ChatMessage = {
            id: `MSG_${Date.now()}`,
            type: 'user',
            user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl, level: user.level },
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
            ...(replyingTo && { replyTo: { messageId: replyingTo.id, userName: replyingTo.user.name, text: replyingTo.text } }),
        };

        setMessages(prev => [...prev, messageToSend]);
        setNewMessage('');
        setReplyingTo(null);
        setTimeout(() => scrollToBottom(), 0);
    };

    const handleReaction = (message: ChatMessage, emoji: string) => {
        setMessages(prev => prev.map(m => {
            if (m.id === message.id) {
                const reactions = { ...(m.reactions || {}) };
                const userList = reactions[emoji] || [];
                if (userList.includes(user.id)) {
                    reactions[emoji] = userList.filter(uid => uid !== user.id);
                    if (reactions[emoji].length === 0) delete reactions[emoji];
                } else {
                    reactions[emoji] = [...userList, user.id];
                }
                return { ...m, reactions };
            }
            return m;
        }));
    };

    const processedMessages = useMemo(() => {
        const result: { type: 'message' | 'date_separator'; data: any; isStartOfGroup?: boolean }[] = [];
        let lastDate: string | null = null, lastSenderId: string | null = null;
        messages.forEach(msg => {
            const currentDate = new Date(msg.timestamp).toDateString();
            if (currentDate !== lastDate) {
                result.push({ type: 'date_separator', data: formatDateSeparator(currentDate) });
                lastDate = currentDate;
                lastSenderId = null;
            }
            result.push({ type: 'message', data: msg, isStartOfGroup: msg.user.id !== lastSenderId });
            lastSenderId = msg.user.id;
        });
        return result;
    }, [messages]);

    useEffect(() => {
        let typingTimeout: NodeJS.Timeout;
        if(newMessage.length > 0) {
            // In a real app, you'd emit a "start typing" event here
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                // And emit a "stop typing" event here
            }, 3000);
        }
        return () => clearTimeout(typingTimeout);
    }, [newMessage]);

    return (
        <div className="flex h-full bg-dark-800/70 backdrop-blur-sm border border-dark-700 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-brand-primary/20 animate-gradient-animation bg-[length:200%_200%] -z-10"></div>
            {viewingUser && <UserProfileModal user={viewingUser} onClose={() => setViewingUser(null)} />}
            
            <div className="flex flex-col flex-1 min-w-0">
                <header className="flex items-center justify-between p-4 border-b border-dark-700/50 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">Общий чат</h2>
                        <p className="text-sm text-green-400 animate-pulse">{MOCK_ONLINE_USERS.length} онлайн</p>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-full hover:bg-dark-700 lg:hidden">
                        <Users className="h-5 w-5 text-gray-300" />
                    </button>
                </header>

                {showPinned && <PinnedMessage message={PINNED_CHAT_MESSAGE} onDismiss={() => setShowPinned(false)} />}
                
                <main className="flex-1 p-2 sm:p-4 overflow-y-auto relative min-h-0" ref={chatContainerRef}>
                    {processedMessages.map((item, index) => {
                        if (item.type === 'date_separator') {
                            return <div key={index} className="text-center text-xs text-gray-500 py-2"><span className="bg-dark-900/50 px-2 py-1 rounded-full">{item.data}</span></div>;
                        }
                        return <MessageBubble key={item.data.id} message={item.data} isStartOfGroup={item.isStartOfGroup!} onReply={setReplyingTo} onReact={handleReaction} onUserClick={setViewingUser} />;
                    })}
                    {isTyping && <TypingIndicator />}
                    <div className="h-4"/> {/* Spacer */}
                </main>

                <footer className="flex-shrink-0 border-t border-dark-700/50">
                    {replyingTo && <ReplyPreview message={replyingTo} onCancel={() => setReplyingTo(null)} />}
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2 p-4">
                        <button type="button" className="p-3 text-gray-400 hover:text-brand-accent transition-colors"><Paperclip className="h-5 w-5"/></button>
                        <textarea ref={messageInputRef} value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }} placeholder="Ваше сообщение..." className="w-full p-3 bg-dark-900/50 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all resize-none max-h-32" rows={1} />
                        <Button type="submit" className="!px-4 !py-3 self-stretch" disabled={!newMessage.trim()}><Send className="h-5 w-5" /></Button>
                    </form>
                </footer>
            </div>
            
            <ChatSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                onUserClick={(user) => {
                    setViewingUser(user);
                    setSidebarOpen(false);
                }}
            />
        </div>
    );
};

export default Chat;