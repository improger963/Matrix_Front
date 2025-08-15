import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, AtSign, KeyRound, UserPlus } from 'lucide-react';
import Button from './ui/Button.tsx';

const RegisterPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4 relative overflow-hidden">
            <div className="animated-grid opacity-30"></div>
            <div className="relative z-10 w-full max-w-md py-8">
                <div className="text-center mb-8">
                     <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <Briefcase className="h-10 w-10 text-brand-primary" />
                        <span className="text-2xl font-bold text-white">Nexus Capital</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Создание аккаунта</h1>
                    <p className="text-gray-400">Начните свой путь к вершине.</p>
                </div>

                <form className="bg-dark-800/70 backdrop-blur-sm border border-dark-700 rounded-xl shadow-lg p-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input id="name" type="text" placeholder="Ваше полное имя" className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input id="email" type="email" placeholder="you@example.com" className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
                         <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input id="password" type="password" placeholder="••••••••" className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">Подтверждение пароля</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input id="confirm-password" type="password" placeholder="••••••••" className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" required />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="referrer" className="block text-sm font-medium text-gray-300 mb-2">ID Пригласившего Партнера (опционально)</label>
                        <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input id="referrer" type="text" placeholder="Например: U12345" className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                    </div>
                    
                    <Button type="submit" className="w-full !py-3">Зарегистрироваться</Button>

                    <p className="text-center text-sm text-gray-400">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="font-medium text-brand-accent hover:underline">
                            Войти
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default RegisterPage;