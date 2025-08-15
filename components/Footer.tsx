import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Send, MessageCircle, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark-800 border-t border-dark-700">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <Briefcase className="h-8 w-8 text-brand-primary" />
                            <span className="text-xl font-bold text-white">Nexus Capital</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm">Гипер-реалистичный бизнес-симулятор для построения вашей финансовой империи.</p>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="text-gray-400 hover:text-white"><Send /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><MessageCircle /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Навигация</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white">Главная</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white">О проекте</Link></li>
                            <li><Link to="/how-it-works" className="text-gray-400 hover:text-white">Как это работает</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Правовая информация</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Политика конфиденциальности</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Условия использования</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Контакты</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-dark-700 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Nexus Capital. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
