
import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { UserCircle, Copy, Check } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';

const Profile: React.FC = () => {
    const { user, setUser, addToast } = useAppContext();
    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
    const [copied, setCopied] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setUser({ ...user, name, avatarUrl });
        addToast('Профиль успешно обновлен!', 'success');
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(user.referralLink);
        setCopied(true);
        addToast('Реферальная ссылка скопирована!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="animate-slide-in-up max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <UserCircle className="h-8 w-8 text-brand-primary" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Редактирование профиля</h2>
                    <p className="text-gray-400">Здесь вы можете изменить свои данные.</p>
                </div>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                     <img src={avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt="User Avatar" className="h-24 w-24 rounded-full border-4 border-brand-secondary object-cover" />
                    <div className="w-full">
                        <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-300 mb-1">URL аватара</label>
                        <input
                            id="avatarUrl"
                            type="text"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.png"
                            className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Полное имя</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ваше имя"
                        className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                    />
                </div>
                
                 <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-300 mb-1">Ваш ID</label>
                    <input
                        id="userId"
                        type="text"
                        readOnly
                        value={user.id}
                        className="w-full p-3 bg-dark-900/50 border border-dark-700 rounded-lg focus:outline-none transition-all cursor-not-allowed text-gray-400"
                    />
                </div>

                <div>
                    <label htmlFor="referralLink" className="block text-sm font-medium text-gray-300 mb-1">Реферальная ссылка</label>
                    <div className="flex items-center gap-2">
                        <input
                            id="referralLink"
                            type="text"
                            readOnly
                            value={user.referralLink}
                            className="w-full p-3 bg-dark-900/50 border border-dark-700 rounded-lg focus:outline-none transition-all text-gray-400"
                        />
                         <Button type="button" onClick={handleCopy} className="!px-4 !py-3 shrink-0">
                            {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                <div className="text-right pt-4 border-t border-dark-700">
                    <Button type="submit">Сохранить изменения</Button>
                </div>
            </form>
        </Card>
    );
};

export default Profile;
