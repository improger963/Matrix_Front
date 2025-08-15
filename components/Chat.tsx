
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { Send, MessageSquare, Smile, ChevronDown } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { MOCK_CHAT_MESSAGES, MOCK_USERS_DB } from '../constants.ts';
import type { ChatMessage } from '../types.ts';

type ProcessedMessage = 
    | { type: 'message'; message: ChatMessage; isStartOfGroup: boolean }
    | { type: 'date_separator'; date: string };

const formatChatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
    
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const popularEmojis = ['😀', '😂', '👍', '🔥', '🚀', '💰', '🎉', '🙏', '💪', '🤝'];

const Chat: React.FC = () => {
    const { user } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [typingUser, setTypingUser] = useState<{ name: string } | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior,
        });
    }, []);

    const processedMessages: ProcessedMessage[] = useMemo(() => {
        if (messages.length === 0) return [];

        const result: ProcessedMessage[] = [];
        let lastDate: string | null = null;
        let lastSenderId: string | null = null;
        let lastTimestamp: string | null = null;

        messages.forEach((msg, index) => {
            const currentDate = new Date(msg.timestamp).toDateString();
            if (currentDate !== lastDate) {
                result.push({ type: 'date_separator', date: formatDateSeparator(currentDate) });
                lastDate = currentDate;
                lastSenderId = null; 
            }
            
            const timeSinceLast = lastTimestamp ? new Date(msg.timestamp).getTime() - new Date(lastTimestamp).getTime() : Infinity;

            const isStartOfGroup = msg.user.id !== lastSenderId || timeSinceLast > 5 * 60 * 1000;

            result.push({ type: 'message', message: msg, isStartOfGroup });
            
            lastSenderId = msg.user.id;
            lastTimestamp = msg.timestamp;
        });

        return result;
    }, [messages]);
    
    useEffect(() => {
        // Initial scroll to bottom
        scrollToBottom('auto');
    }, []);

     // Simulate receiving new messages and typing indicators
    useEffect(() => {
        const otherUsers = Object.values(MOCK_USERS_DB).filter(u => u.id !== user.id);
        const possibleMessages = [
            'Кто-нибудь знает, когда следующий вебинар?', 'Отличные результаты у всех!',
            'Только что получил выплату, все работает как часы!', 'Ребята, не забывайте выполнять ежедневные задания.',
            'Крутое обновление в разделе промо-материалов!',
        ];

        const messageInterval = setInterval(() => {
            const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
            const randomMessage = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
            
            const incomingMessage: ChatMessage = {
                id: `MSG_${Date.now()}`, user: randomUser, text: randomMessage,
                timestamp: new Date().toISOString(),
            };
            
            const isScrolledUp = chatContainerRef.current && 
                (chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop > chatContainerRef.current.clientHeight + 100);

            setMessages(prev => [...prev, incomingMessage]);

            if (isScrolledUp) {
                setShowScrollToBottom(true);
            } else {
                scrollToBottom();
            }

        }, 20000); 

         const typingInterval = setInterval(() => {
            if (Math.random() > 0.5) {
                const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
                setTypingUser({ name: randomUser.name.split(' ')[0] });
                setTimeout(() => setTypingUser(null), 4000);
            }
        }, 8000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(typingInterval);
        };
    }, [user.id, scrollToBottom]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageToSend: ChatMessage = {
            id: `MSG_${Date.now()}`,
            user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl, level: user.level },
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, messageToSend]);
        setNewMessage('');
        setShowScrollToBottom(false);
        setTimeout(() => scrollToBottom(), 0);
    };

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 20;
            if (isAtBottom) {
                setShowScrollToBottom(false);
            }
        }
    };
    
    useEffect(() => {
        const input = messageInputRef.current;
        if (input) {
            input.style.height = 'auto';
            input.style.height = `${input.scrollHeight}px`;
        }
    }, [newMessage]);

    return (
        <Card className="animate-slide-in-up flex flex-col h-[calc(100vh-10rem)] max-h-[800px]">
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-brand-primary" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Общий чат</h2>
                    <p className="text-gray-400">Общайтесь с другими участниками проекта</p>
                </div>
            </div>

            <div className="flex-1 bg-dark-900/50 rounded-lg p-2 sm:p-4 overflow-y-auto mb-4 relative" ref={chatContainerRef} onScroll={handleScroll}>
                <div className="space-y-1">
                    {processedMessages.map((item, index) => {
                        if (item.type === 'date_separator') {
                            return (
                                <div key={index} className="text-center text-xs text-gray-500 py-2">
                                    <span className="bg-dark-800 px-2 py-1 rounded-full">{item.date}</span>
                                </div>
                            );
                        }
                        
                        const { message, isStartOfGroup } = item;
                        const isCurrentUser = message.user.id === user.id;

                        return (
                            <div key={message.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isStartOfGroup ? 'mt-3' : ''}`}>
                                {!isCurrentUser && (
                                    <div className="w-8 flex-shrink-0">
                                        {isStartOfGroup && <img src={message.user.avatarUrl} alt={message.user.name} className="h-8 w-8 rounded-full" />}
                                    </div>
                                )}
                                <div className={`max-w-xs md:max-w-md p-2 px-3 rounded-2xl ${isCurrentUser ? 'bg-brand-primary text-white rounded-br-lg' : 'bg-dark-700 text-gray-200 rounded-bl-lg'}`}>
                                    {isStartOfGroup && !isCurrentUser && (
                                        <p className="font-semibold text-brand-accent text-sm mb-1">{message.user.name} <span className="text-gray-500 text-xs">(Ур. {message.user.level})</span></p>
                                    )}
                                    <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-purple-200/80' : 'text-gray-500'} text-right`}>
                                        {formatChatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                 {typingUser && (
                    <div className="sticky bottom-0 left-0 p-2 text-sm text-gray-400 animate-pulse">
                        {typingUser.name} печатает...
                    </div>
                )}

                 {showScrollToBottom && (
                    <button onClick={() => scrollToBottom()} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-brand-primary/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:bg-brand-primary animate-fade-in flex items-center gap-1">
                        <ChevronDown className="h-4 w-4" />
                        Новые сообщения
                    </button>
                 )}
            </div>

            <form onSubmit={handleSendMessage} className="flex items-start gap-3 flex-shrink-0 relative">
                 <div className="relative">
                    <button type="button" onClick={() => setShowEmojiPicker(p => !p)} className="p-3 text-gray-400 hover:text-brand-accent transition-colors">
                        <Smile className="h-5 w-5"/>
                    </button>
                    {showEmojiPicker && (
                         <div className="absolute bottom-full mb-2 bg-dark-700 p-2 rounded-lg shadow-xl grid grid-cols-5 gap-1">
                            {popularEmojis.map(emoji => (
                                <button type="button" key={emoji} onClick={() => setNewMessage(m => m + emoji)} className="p-1 text-2xl rounded-md hover:bg-dark-600 transition-colors">
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    placeholder="Введите ваше сообщение..."
                    className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all resize-none max-h-32"
                    rows={1}
                />
                <Button type="submit" className="!px-4 !py-3 self-end" disabled={!newMessage.trim()}>
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </Card>
    );
};

export default Chat;
