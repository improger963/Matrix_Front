
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
                <p className="text-sm text-brand-accent mb-6">Приглашает вас в свою команду</p>

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
                    <div className="bg-dark-700/50 p-2 rounded-lg"><p className="text-xl font-bold text-white">{user.referrals}</p><p className="text-xs text-gray-400">В команде</p></div>
                    <div className="bg-dark-700/50 p-2 rounded-lg"><p className="text-xl font-bold text-white">{user.level}</p><p className="text-xs text-gray-400">Уровень</p></div>
                    <div className="bg-dark-700/50 p-2 rounded-lg"><p className="text-xl font-bold text-white">${user.teamEarnings?.toLocaleString('ru-RU')}</p><p className="text-xs text-gray-400">Доход команды</p></div>
                </div>

                <Button className="w-full !py-3 animate-glow">
                    Присоединиться к команде
                </Button>
                 <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Powered by MatrixFlow</span>
                </div>
            </div>
        </div>
    );
};

const QrCodeModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 text-center relative animate-pop-in" onClick={e => e.stopPropagation()}>
             <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full hover:bg-dark-700"><X className="h-5 w-5 text-gray-400"/></button>
            <h3 className="text-lg font-semibold text-white mb-4">Поделиться QR-кодом</h3>
             <div className="bg-white p-4 rounded-lg inline-block">
                <QRCode value={url} size={192} />
            </div>
            <p className="text-xs text-gray-500 mt-4 max-w-xs">Наведите камеру телефона, чтобы мгновенно перейти на страницу.</p>
        </div>
    </div>
);

const LandingPage: React.FC = () => {
    const { user, setUser, addToast } = useAppContext();
    const [welcomeMessage, setWelcomeMessage] = useState(user.welcomeMessage || '');
    const [initialMessage, setInitialMessage] = useState(user.welcomeMessage || '');
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isQrModalOpen, setQrModalOpen] = useState(false);
    
    const publicUrl = `https://matrixflow.app/p/${user.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        addToast("Ссылка скопирована!", "success");
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleEditToggle = () => {
        setInitialMessage(welcomeMessage);
        setIsEditing(true);
    };
    
    const handleSave = () => {
        setUser({ ...user, welcomeMessage });
        setIsEditing(false);
        addToast("Приветственное сообщение сохранено!", "success");
    };

    const handleCancel = () => {
        setWelcomeMessage(initialMessage);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center gap-3 mb-2">
                    <Link className="h-8 w-8 text-brand-primary" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Ваша персональная страница</h2>
                        <p className="text-gray-400">Готовый инструмент для привлечения партнеров.</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-white mb-2">Ваша уникальная ссылка</h3>
                         <div className="flex items-center gap-2">
                            <input type="text" readOnly value={publicUrl} className="w-full p-3 bg-dark-900/50 border border-dark-700 rounded-lg focus:outline-none text-gray-300" />
                        </div>
                         <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <Button onClick={handleCopy} variant="secondary" className="w-full flex items-center justify-center gap-2"><Copy className="h-4 w-4" />{copied ? 'Готово!' : 'Копировать'}</Button>
                            <a href={`https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(welcomeMessage)}`} target="_blank" rel="noopener noreferrer" className="bg-dark-700 text-gray-200 hover:bg-dark-600 focus:ring-brand-accent px-4 py-2.5 font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"><Send className="h-4 w-4"/> Telegram</a>
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(welcomeMessage + ' ' + publicUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-dark-700 text-gray-200 hover:bg-dark-600 focus:ring-brand-accent px-4 py-2.5 font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"><MessageCircle className="h-4 w-4"/> WhatsApp</a>
                            <Button onClick={() => setQrModalOpen(true)} variant="secondary" className="w-full flex items-center justify-center gap-2"><QrCode className="h-4 w-4"/> QR-код</Button>
                         </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">Ваше приветствие</h3>
                            {!isEditing && (
                                <Button onClick={handleEditToggle} variant="secondary" className="!px-3 !py-1 !text-xs">
                                    <Share2 className="h-4 w-4 mr-1"/>Редактировать
                                </Button>
                            )}
                        </div>
                        <p className="text-sm text-gray-400">Это сообщение увидят все, кто перейдет по вашей ссылке. Кликните на текст в предпросмотре справа, чтобы его изменить.</p>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                     <Card className="!p-2">
                        <div onClick={() => !isEditing && handleEditToggle()} className={`cursor-pointer rounded-lg ${isEditing ? 'ring-2 ring-brand-primary' : ''}`}>
                             <LandingPagePreview 
                                isEditing={isEditing}
                                welcomeMessage={welcomeMessage}
                                setWelcomeMessage={setWelcomeMessage}
                                onSave={handleSave}
                                onCancel={handleCancel}
                            />
                        </div>
                    </Card>
                </div>
            </div>
            {isQrModalOpen && <QrCodeModal url={publicUrl} onClose={() => setQrModalOpen(false)} />}
        </div>
    );
};

export default LandingPage;
