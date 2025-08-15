

import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Link, QrCode, Copy, Check, Users, Award, ShieldCheck, DollarSign, Share2, Save, X, Send, MessageCircle } from 'lucide-react';
import QRCode from "react-qr-code";

interface LandingPagePreviewProps {
    isEditing: boolean;
    welcomeMessage: string;
    setWelcomeMessage: (msg: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ isEditing, welcomeMessage, setWelcomeMessage, onSave, onCancel }) => {
    const { user } = useAppContext();

    return (
        <div className="w-full bg-dark-900 rounded-2xl border-2 border-dark-700 p-1 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-brand-primary/30 to-dark-900/0"></div>
            <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 text-center relative z-10">
                <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-28 h-28 rounded-full mx-auto border-4 border-brand-primary mb-4 shadow-lg"
                />
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-sm text-brand-accent mb-6">Приглашает вас в свою Бизнес-сеть</p>

                <div className="text-gray-300 text-sm leading-relaxed mb-8 min-h-[84px] p-3 rounded-lg bg-dark-900/50 border border-dark-700">
                    {isEditing ? (
                        <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            className="w-full h-full bg-transparent focus:outline-none resize-none text-center"
                            rows={3}
                            autoFocus
                        />
                    ) : (
                        <p>"{welcomeMessage || 'Присоединяйтесь к нашей команде и начните зарабатывать уже сегодня!'}"</p>
                    )}
                </div>
                 {isEditing && (
                    <div className="flex justify-center gap-2 mb-8">
                        <Button onClick={onSave} className="!px-4 !py-1.5 !text-xs"><Save className="h-4 w-4 mr-1"/>Сохранить</Button>
                        <Button onClick={onCancel} variant="secondary" className="!px-4 !py-1.5 !text-xs"><X className="h-4 w-4 mr-1"/>Отмена</Button>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-2 text-center mb-8">
                    <div className="bg-dark-700/50 p-2 rounded-lg"><p className="text-xl font-bold text-white">{user.partners}</p><p className="text-xs text-gray-400">В сети</p></div>
                    <div className="bg-dark-700/50 p-2 rounded-lg"><p className="text-xl font-bold text-white">{user.fundingCompleted}</p><p className="text-xs text-gray-400">Exits</p></div>
                    <div className="bg-dark-700/50 p-2 rounded-lg"><p className="text-xl font-bold text-white">{user.networkProfit?.toLocaleString('ru-RU')}</p><p className="text-xs text-gray-400">Прибыль ($CAP)</p></div>
                </div>

                <Button className="w-full !py-3">Присоединиться к Бизнес-сети</Button>
            </div>
        </div>
    );
};

const ContactCard: React.FC = () => {
    const { user } = useAppContext();
    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold text-white mb-4">Связаться со мной</h3>
            <div className="space-y-3">
                 <a href={`https://t.me/${user.socials?.telegram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors">
                    <Send className="h-6 w-6 text-brand-accent"/>
                    <div>
                        <p className="font-semibold text-white">Telegram</p>
                        <p className="text-xs text-gray-400">@{user.socials?.telegram}</p>
                    </div>
                </a>
                 <a href={`https://vk.com/${user.socials?.vk}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors">
                    <MessageCircle className="h-6 w-6 text-brand-accent"/>
                    <div>
                        <p className="font-semibold text-white">ВКонтакте</p>
                        <p className="text-xs text-gray-400">@{user.socials?.vk}</p>
                    </div>
                </a>
            </div>
        </Card>
    )
}

const LinkSharingCard: React.FC = () => {
     const { user, addToast } = useAppContext();
     const [copied, setCopied] = useState(false);
     const handleCopy = () => {
        navigator.clipboard.writeText(user.referralLink);
        setCopied(true);
        addToast('Ссылка скопирована!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold text-white mb-4">Поделиться страницей</h3>
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Ваша персональная ссылка</p>
                    <div className="flex items-center gap-2">
                        <input type="text" readOnly value={user.referralLink} className="truncate bg-dark-900/50 p-2 rounded-lg border border-dark-600 w-full text-sm"/>
                        <Button onClick={handleCopy} className="!px-3 !py-2 shrink-0">
                            {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
                 <div className="flex items-center justify-center gap-4 pt-4">
                     <a href={`https://t.me/share/url?url=${encodeURIComponent(user.referralLink)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-dark-700/50 hover:bg-dark-700 rounded-full transition-colors"><Send className="h-6 w-6 text-gray-300"/></a>
                     <a href={`https://vk.com/share.php?url=${encodeURIComponent(user.referralLink)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-dark-700/50 hover:bg-dark-700 rounded-full transition-colors"><Share2 className="h-6 w-6 text-gray-300"/></a>
                 </div>
            </div>
        </Card>
    )
};


const LandingPage: React.FC = () => {
    const { user, setUser, addToast } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState(user.welcomeMessage || '');

    const handleSave = () => {
        setUser(prev => ({ ...prev, welcomeMessage }));
        setIsEditing(false);
        addToast('Приветственное сообщение обновлено!', 'success');
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className="relative">
                     {!isEditing && (
                        <Button 
                            variant="secondary" 
                            className="absolute top-4 right-4 !px-3 !py-1.5 text-xs"
                            onClick={() => setIsEditing(true)}
                        >
                            Редактировать
                        </Button>
                    )}
                    <LandingPagePreview 
                        isEditing={isEditing} 
                        welcomeMessage={welcomeMessage} 
                        setWelcomeMessage={setWelcomeMessage}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                    />
                </Card>
            </div>
            <div className="space-y-6">
                <LinkSharingCard />
                <ContactCard />
            </div>
        </div>
    );
};

export default LandingPage;
