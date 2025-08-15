import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, AtSign, KeyRound } from 'lucide-react';
import Button from './ui/Button.tsx';

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4 relative overflow-hidden">
            <div className="animated-grid opacity-30"></div>
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <Briefcase className="h-10 w-10 text-brand-primary" />
                        <span className="text-2xl font-bold text-white">Nexus Capital</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Вход в аккаунт</h1>
                    <p className="text-gray-400">Добро пожаловать обратно, CEO!</p>
                </div>

                <form className="bg-dark-800/70 backdrop-blur-sm border border-dark-700 rounded-xl shadow-lg p-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Пароль</label>
                            <a href="#" className="text-xs text-brand-accent hover:underline">Забыли пароль?</a>
                        </div>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full !py-3">Войти</Button>

                    <p className="text-center text-sm text-gray-400">
                        Еще нет аккаунта?{' '}
                        <Link to="/register" className="font-medium text-brand-accent hover:underline">
                            Зарегистрироваться
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
