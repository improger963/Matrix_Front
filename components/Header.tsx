import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Button from './ui/Button.tsx';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: "Главная", href: "/" },
        { name: "О проекте", href: "/about" },
        { name: "Как это работает", href: "/how-it-works" },
        { name: "FAQ", href: "/faq" },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50 shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="flex items-center gap-2">
                    <Briefcase className="h-8 w-8 text-brand-primary" />
                    <span className="text-xl font-bold text-white">Nexus Capital</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <NavLink 
                            key={link.name} 
                            to={link.href} 
                            end // Make sure only the exact path is active
                            className={({ isActive }) => 
                                `text-sm font-semibold transition-colors ${isActive ? 'text-brand-primary' : 'text-gray-300 hover:text-white'}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    <Link to="/login">
                        <Button variant="secondary" className="!px-5 !py-2">Вход</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary" className="!px-5 !py-2">Регистрация</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
