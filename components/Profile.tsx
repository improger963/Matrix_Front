
import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { UserCircle, Copy, Check, Send, Globe, KeyRound, Shield, Eye, AtSign, Link as LinkIcon, Trophy } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { MOCK_ACHIEVEMENTS } from '../constants.ts';

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; icon: React.ReactNode; type?: string }> = ({ label, id, value, onChange, placeholder, icon, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{icon}</span>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-3 pl-10 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
            />
        </div>
    </div>
);

const Profile: React.FC = () => {
    const { user, setUser, addToast, setActiveView } = useAppContext();

    const [formData, setFormData] = useState({
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio || '',
        telegram: user.socials?.telegram || '',
        vk: user.socials?.vk || '',
        website: user.socials?.website || ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setUser({
            ...user,
            name: formData.name,
            avatarUrl: formData.avatarUrl,
            bio: formData.bio,
            socials: {
                telegram: formData.telegram,
                vk: formData.vk,
                website: formData.website
            }
        });
        addToast('Профиль успешно обновлен!', 'success');
    };

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(user.referralLink);
        setCopied(true);
        addToast('Реферальная ссылка скопирована!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };
    
    const unlockedAchievements = MOCK_ACHIEVEMENTS.filter(a => a.unlocked).slice(0, 3);
    const nextAchievement = MOCK_ACHIEVEMENTS.find(a => !a.unlocked && a.progress);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
                 <form onSubmit={handleSave}>
                    <Card className="animate-slide-in-up">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-700">
                             <img src={formData.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt="User Avatar" className="h-24 w-24 rounded-full border-4 border-brand-secondary object-cover" />
                             <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                <p className="text-gray-400">Уровень {user.level} | ID: {user.id}</p>
                                <div className="mt-2">
                                     <InputField
                                        id="avatarUrl"
                                        label="URL аватара"
                                        value={formData.avatarUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/avatar.png"
                                        icon={<LinkIcon className="h-4 w-4" />}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <InputField
                                id="name"
                                label="Полное имя"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ваше имя"
                                icon={<UserCircle className="h-5 w-5" />}
                            />
                             <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">О себе</label>
                                <textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Расскажите немного о себе..."
                                    rows={3}
                                    className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-dark-700">Социальные сети</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <InputField
                                    id="telegram"
                                    label="Telegram"
                                    value={formData.telegram}
                                    onChange={handleInputChange}
                                    placeholder="Ваш username"
                                    icon={<Send className="h-5 w-5" />}
                                />
                                 <InputField
                                    id="vk"
                                    label="ВКонтакте"
                                    value={formData.vk}
                                    onChange={handleInputChange}
                                    placeholder="Ваш ID или короткое имя"
                                    icon={<AtSign className="h-5 w-5" />}
                                />
                                <InputField
                                    id="website"
                                    label="Личный сайт"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="example.com"
                                    icon={<Globe className="h-5 w-5" />}
                                />
                            </div>
                        </div>
                         <div className="text-right pt-6 mt-6 border-t border-dark-700">
                            <Button type="submit">Сохранить изменения</Button>
                        </div>
                    </Card>
                 </form>
            </div>

             {/* Right Column: Actions, Achievements, Security */}
            <div className="space-y-6">
                <Card className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                     <h3 className="text-lg font-semibold text-white mb-4">Действия</h3>
                     <div className="space-y-2">
                        <Button onClick={() => setActiveView('landingPage')} variant="secondary" className="w-full flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" /> Посмотреть страницу
                        </Button>
                        <Button onClick={handleCopy} variant="secondary" className="w-full flex items-center justify-center gap-2">
                             <Copy className="h-4 w-4" /> {copied ? 'Ссылка скопирована!' : 'Копировать реф. ссылку'}
                        </Button>
                     </div>
                </Card>

                <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                     <h3 className="text-lg font-semibold text-white mb-4">Мои достижения</h3>
                      <div className="space-y-3">
                        {unlockedAchievements.map(ach => (
                            <div key={ach.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ach.icon className="h-5 w-5 text-brand-accent" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{ach.title}</p>
                                    <p className="text-xs text-gray-400">{ach.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                     {nextAchievement?.progress && (
                        <div className="mt-4 pt-4 border-t border-dark-700">
                             <p className="text-xs text-gray-400 mb-1">Следующая цель: {nextAchievement.title}</p>
                             <div className="w-full bg-dark-700 rounded-full h-1.5">
                                 <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${(nextAchievement.progress.current / nextAchievement.progress.target) * 100}%` }}></div>
                             </div>
                        </div>
                    )}
                    <Button onClick={() => setActiveView('guild', { subView: 'achievements' })} variant="secondary" className="w-full mt-4 text-xs">
                        <Trophy className="h-4 w-4 mr-2"/> Все достижения
                    </Button>
                </Card>

                <Card className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-lg font-semibold text-white mb-4">Безопасность</h3>
                    <div className="space-y-4">
                        <InputField
                            id="currentPassword"
                            label="Текущий пароль"
                            type="password"
                            value=""
                            onChange={() => {}}
                            icon={<KeyRound className="h-5 w-5" />}
                        />
                         <InputField
                            id="newPassword"
                            label="Новый пароль"
                            type="password"
                            value=""
                            onChange={() => {}}
                            icon={<KeyRound className="h-5 w-5" />}
                        />
                        <Button variant="secondary" className="w-full">Сменить пароль</Button>
                         <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-gray-400"/>
                                <span className="text-sm font-medium text-gray-300">2FA Аутентификация</span>
                            </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
