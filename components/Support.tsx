
import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { LifeBuoy, Send, CheckCircle, Mail, MessageSquare } from 'lucide-react';

const Support: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            return;
        }
        console.log({ subject, message });
        setSubmitted(true);
        setSubject('');
        setMessage('');
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className="animate-slide-in-up">
                    <div className="flex items-center gap-3 mb-6">
                        <LifeBuoy className="h-8 w-8 text-brand-primary" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Центр поддержки</h2>
                            <p className="text-gray-400">Возникли вопросы? Мы готовы помочь!</p>
                        </div>
                    </div>
                    {submitted ? (
                         <div className="flex flex-col items-center justify-center text-center p-8 bg-dark-700/50 rounded-lg min-h-[300px]">
                            <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                            <h3 className="text-xl font-bold text-white">Ваш запрос отправлен!</h3>
                            <p className="text-gray-400 mt-2">Наша команда поддержки свяжется с вами в ближайшее время. Обычно мы отвечаем в течение 24 часов.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Тема обращения</label>
                                <input
                                    id="subject"
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Например: Проблема с выводом средств"
                                    required
                                    className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Подробное описание</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Опишите вашу проблему как можно подробнее..."
                                    required
                                    rows={6}
                                    className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                                />
                            </div>
                            <div className="text-right">
                                <Button type="submit">
                                    <span className="flex items-center gap-2">
                                        <Send className="h-5 w-5" />
                                        Отправить запрос
                                    </span>
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-lg font-bold text-white mb-4">Другие способы связи</h3>
                    <div className="space-y-3">
                         <a href="mailto:support@realty-guilds.app" className="flex items-center gap-3 p-3 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors">
                            <Mail className="h-6 w-6 text-brand-accent"/>
                            <div>
                                <p className="font-semibold text-white">Email</p>
                                <p className="text-xs text-gray-400">support@realty-guilds.app</p>
                            </div>
                        </a>
                        <a href="https://t.me/realty_guilds_support" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors">
                            <MessageSquare className="h-6 w-6 text-brand-accent"/>
                             <div>
                                <p className="font-semibold text-white">Telegram</p>
                                <p className="text-xs text-gray-400">@realty_guilds_support</p>
                            </div>
                        </a>
                    </div>
                     <p className="text-xs text-gray-500 mt-4">Время работы поддержки: Пн-Пт, с 10:00 до 19:00 (МСК)</p>
                </Card>
            </div>
        </div>
    );
};

export default Support;
