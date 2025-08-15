
import React, { useState, useMemo } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import type { AcademyArticle } from '../types.ts';
import { GraduationCap, Lock, PlayCircle, FileText, X, Zap, CheckCircle, Search, Video, BookOpen } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';

// --- SUB-COMPONENTS ---

const ArticleModal: React.FC<{ article: AcademyArticle; onClose: () => void; onComplete: (id: string) => void }> = ({ article, onClose, onComplete }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-backdrop"
            onClick={onClose}
        >
            <div 
                className="bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl w-full max-w-3xl animate-slide-in-up-modal flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-dark-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {article.type === 'video' ? <Video className="h-6 w-6 text-brand-primary" /> : <BookOpen className="h-6 w-6 text-brand-primary" />}
                        <h3 className="text-lg font-bold text-white">{article.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-dark-700"><X className="h-5 w-5 text-gray-400" /></button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {article.type === 'video' ? (
                        <div className="aspect-video bg-dark-900 rounded-lg flex items-center justify-center">
                           <PlayCircle className="h-20 w-20 text-gray-600" />
                        </div>
                    ) : (
                         <img src={article.coverUrl} alt={article.title} className="w-full h-56 object-cover rounded-lg mb-4" />
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Категория: <span className="font-semibold text-brand-accent">{article.category}</span></span>
                        {article.duration && <span>Длительность: <span className="font-semibold text-white">{article.duration}</span></span>}
                    </div>
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed">{article.content}</p>
                </div>

                <footer className="p-4 bg-dark-900/50 rounded-b-2xl border-t border-dark-700 flex-shrink-0 flex items-center justify-between">
                     <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-300 flex items-center gap-1.5">
                       <Zap className="w-5 h-5" /> +{article.xpReward} XP
                    </div>
                    <Button onClick={() => onComplete(article.id)} disabled={article.isCompleted}>
                        {article.isCompleted ? (
                             <><CheckCircle className="h-5 w-5 mr-2" /> Урок пройден</>
                        ) : (
                            'Завершить и получить XP'
                        )}
                    </Button>
                </footer>
            </div>
        </div>
    );
};

const ArticleCard: React.FC<{ article: AcademyArticle; onSelect: (article: AcademyArticle) => void; userLevel: number; }> = ({ article, onSelect, userLevel }) => {
    const isLocked = article.isLocked && userLevel < 5; // Example lock condition

    return (
        <Card 
            className={`
                !p-0 overflow-hidden group transition-all duration-300 
                ${isLocked ? 'saturate-50' : 'hover:shadow-brand-primary/20 hover:-translate-y-1 cursor-pointer'}
            `}
            onClick={() => !isLocked && onSelect(article)}
        >
            <div className="relative">
                <img src={article.coverUrl} alt={article.title} className="w-full h-40 object-cover" />
                
                {isLocked && (
                    <div className="absolute inset-0 bg-dark-900/80 flex flex-col items-center justify-center text-center p-4">
                        <Lock className="h-8 w-8 text-yellow-400 mb-2" />
                        <p className="font-semibold text-white">Доступно на 5 уровне</p>
                    </div>
                )}

                {article.isCompleted && !isLocked && (
                     <div className="absolute inset-0 bg-green-900/70 flex flex-col items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-400" />
                        <p className="font-semibold text-white mt-2">Просмотрено</p>
                    </div>
                )}

                {!isLocked && !article.isCompleted && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="h-16 w-16 text-white/80" />
                    </div>
                )}
                
                <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full text-white ${
                    article.category === 'Для новичков' ? 'bg-blue-500/80' :
                    article.category === 'Масштабирование' ? 'bg-green-500/80' : 'bg-purple-500/80'
                }`}>
                    {article.category}
                </span>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-white truncate h-6">{article.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                        {article.type === 'video' ? <Video className="h-4 w-4"/> : <FileText className="h-4 w-4"/>}
                        <span>{article.type === 'video' ? `Видео / ${article.duration}` : 'Статья'}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-yellow-400">
                        <Zap className="h-4 w-4" />
                        <span>{article.xpReward} XP</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};


// --- MAIN COMPONENT ---

const Academy: React.FC = () => {
    const { user, academyArticles, completeAcademyArticle } = useAppContext();
    const [selectedArticle, setSelectedArticle] = useState<AcademyArticle | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [activeType, setActiveType] = useState<string>('all');
    
    const categories = useMemo(() => ['all', ...Array.from(new Set(academyArticles.map(a => a.category)))], [academyArticles]);
    const types = ['all', 'video', 'article'];

    const filteredArticles = useMemo(() => {
        return academyArticles.filter(article => {
            const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
            const matchesType = activeType === 'all' || article.type === activeType;
            const matchesSearch = !searchQuery || article.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesType && matchesSearch;
        });
    }, [academyArticles, searchQuery, activeCategory, activeType]);

    const articlesByGroup = useMemo(() => {
        return filteredArticles.reduce((acc, article) => {
            (acc[article.category] = acc[article.category] || []).push(article);
            return acc;
        }, {} as Record<string, AcademyArticle[]>);
    }, [filteredArticles]);

    const stats = useMemo(() => {
        const completed = academyArticles.filter(a => a.isCompleted).length;
        const total = academyArticles.length;
        const totalXp = academyArticles.reduce((sum, a) => sum + a.xpReward, 0);
        const earnedXp = academyArticles.filter(a => a.isCompleted).reduce((sum, a) => sum + a.xpReward, 0);
        return { completed, total, totalXp, earnedXp, progress: total > 0 ? (completed / total) * 100 : 0 };
    }, [academyArticles]);
    

    return (
        <div className="space-y-6 animate-slide-in-up">
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-brand-primary" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Nexus Institute</h2>
                            <p className="text-gray-400">Ваш путь к успеху начинается здесь. Изучайте и применяйте!</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-dark-700/50 p-4 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-400">Общий прогресс</p>
                        <div className="w-full bg-dark-900 rounded-full h-2.5 mt-2">
                            <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${stats.progress}%` }}></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Уроков пройдено</p>
                        <p className="text-xl font-bold text-white">{stats.completed} / {stats.total}</p>
                    </div>
                     <div className="text-center">
                        <p className="text-sm text-gray-400">Опыта получено (XP)</p>
                        <p className="text-xl font-bold text-white">{stats.earnedXp} / {stats.totalXp}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                     <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск по названию..."
                            className="w-full bg-dark-900 border border-dark-600 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-dark-800 p-1 rounded-lg">
                        {categories.map(cat => (
                           <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 text-sm rounded-md transition-colors ${activeCategory === cat ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-dark-700'}`}>{cat === 'all' ? 'Все' : cat}</button> 
                        ))}
                    </div>
                     <div className="flex items-center gap-2 bg-dark-800 p-1 rounded-lg">
                        <button onClick={() => setActiveType('all')} className={`px-3 py-1 text-sm rounded-md transition-colors ${activeType === 'all' ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-dark-700'}`}>Все</button>
                        <button onClick={() => setActiveType('video')} className={`px-3 py-1 text-sm rounded-md transition-colors ${activeType === 'video' ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-dark-700'}`}><Video className="w-4 h-4 inline mr-1" />Видео</button>
                        <button onClick={() => setActiveType('article')} className={`px-3 py-1 text-sm rounded-md transition-colors ${activeType === 'article' ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-dark-700'}`}><FileText className="w-4 h-4 inline mr-1" />Статьи</button>
                    </div>
                </div>

                {Object.keys(articlesByGroup).length > 0 ? Object.entries(articlesByGroup).map(([category, articles]) => (
                    <div key={category} className="mt-6">
                        <h3 className="text-xl font-bold text-white mb-4">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map(article => (
                                <ArticleCard key={article.id} article={article} onSelect={setSelectedArticle} userLevel={user.level} />
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>Ничего не найдено по вашему запросу.</p>
                        <p className="text-sm">Попробуйте изменить фильтры или поисковый запрос.</p>
                    </div>
                )}
            </Card>

            {selectedArticle && (
                <ArticleModal 
                    article={selectedArticle} 
                    onClose={() => setSelectedArticle(null)} 
                    onComplete={completeAcademyArticle} 
                />
            )}
        </div>
    );
};

export default Academy;