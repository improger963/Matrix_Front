
import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Sparkles, Send, LoaderCircle, BrainCircuit } from 'lucide-react';
import { generateMarketingContentStream } from '../services/geminiService.ts';
import { getAITeamAnalysisStream } from '../services/geminiService.ts';
import { MOCK_NETWORK_MEMBERS } from '../constants.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import Button from './ui/Button.tsx';

const AssistantWidget: React.FC = () => {
    const { addToast } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ id: number, sender: 'user' | 'ai', text: string, isStreaming?: boolean }[]>([
        { id: 1, sender: 'ai', text: 'Здравствуйте! Я N.C.A., ваш персональный AI-ассистент. Чем могу помочь?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showProactiveTip, setShowProactiveTip] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) {
                setShowProactiveTip(true);
            }
        }, 15000); // Proactive tip after 15 seconds
        return () => clearTimeout(timer);
    }, [isOpen]);
    
    const handleSendMessage = async (prompt?: string) => {
        const userMessage = prompt || input;
        if (!userMessage.trim() || isLoading) return;

        const newMessages = [...messages, { id: Date.now(), sender: 'user' as const, text: userMessage }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const aiResponseId = Date.now() + 1;
        setMessages(prev => [...prev, { id: aiResponseId, sender: 'ai' as const, text: '', isStreaming: true }]);

        try {
            if (userMessage.toLowerCase().includes('анализ')) {
                await getAITeamAnalysisStream(MOCK_NETWORK_MEMBERS, (chunk) => {
                    setMessages(prev => prev.map(m => m.id === aiResponseId ? { ...m, text: m.text + chunk } : m));
                });
            } else {
                await generateMarketingContentStream(userMessage, (chunk) => {
                    setMessages(prev => prev.map(m => m.id === aiResponseId ? { ...m, text: m.text + chunk } : m));
                });
            }
        } catch (e: any) {
             setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'ai' as const, text: 'К сожалению, произошла ошибка. Попробуйте еще раз.' }]);
             addToast(e.message, 'error');
        } finally {
             setMessages(prev => prev.map(m => m.id === aiResponseId ? { ...m, isStreaming: false } : m));
             setIsLoading(false);
        }
    };
    
    const quickActions = [
        { label: 'Проанализируй мою Бизнес-сеть', prompt: 'Сделай детальный AI-анализ моей Бизнес-сети' },
        { label: 'Напиши пост для Telegram', prompt: 'Напиши короткий рекламный пост для Telegram о Nexus Capital' },
    ];
    
    return (
        <>
            <div className={`fixed bottom-6 right-6 z-[90] transition-transform duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                {showProactiveTip && (
                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-dark-700 p-3 rounded-lg shadow-xl animate-fade-in">
                         <p className="text-xs text-white"><b className="text-brand-accent">N.C.A. Совет:</b> Похоже, у вас есть неактивные партнеры. Запросите анализ Бизнес-сети, чтобы получить план по их реактивации!</p>
                         <button onClick={() => setShowProactiveTip(false)} className="absolute top-1 right-1 p-1 text-gray-500 hover:text-white"><X className="w-3 h-3"/></button>
                    </div>
                )}
                 <button onClick={() => { setIsOpen(true); setShowProactiveTip(false); }} className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center shadow-2xl shadow-brand-primary/40 hover:scale-105 transform transition-all">
                    <Bot className="w-8 h-8 text-white" />
                    {showProactiveTip && <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-dark-900 animate-pulse" />}
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 z-[90] w-[calc(100%-48px)] max-w-sm h-[70vh] max-h-[550px] bg-dark-800/80 backdrop-blur-xl border border-dark-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-dark-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Bot className="w-6 h-6 text-brand-primary" />
                        <h3 className="font-bold text-white">N.C.A. Ассистент</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-dark-700"><X className="w-5 w-5 text-gray-400" /></button>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                             {msg.sender === 'ai' && <div className="w-6 h-6 bg-dark-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><Sparkles className="w-4 h-4 text-brand-accent"/></div>}
                             <div className={`p-3 rounded-2xl max-w-xs text-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-dark-700 text-gray-200 rounded-bl-none'}`}>
                                {msg.text}
                                {msg.isStreaming && <span className="inline-block w-1 h-4 bg-white ml-1 animate-pulse"></span>}
                             </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-4 border-t border-dark-700">
                     <div className="flex flex-wrap gap-2 mb-2">
                        {quickActions.map(action => (
                            <button key={action.label} onClick={() => handleSendMessage(action.prompt)} disabled={isLoading} className="text-xs bg-dark-700 hover:bg-dark-600 text-gray-300 px-3 py-1 rounded-full transition-colors disabled:opacity-50">
                                {action.label}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Спросите что-нибудь..."
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"
                            disabled={isLoading}
                        />
                         <Button type="submit" className="!p-2.5" disabled={isLoading || !input.trim()}>
                            {isLoading ? <LoaderCircle className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5"/>}
                        </Button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default AssistantWidget;
