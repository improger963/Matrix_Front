
import React from 'react';
import Card from './ui/Card.tsx';
import { MOCK_ACADEMY_ARTICLES } from '../constants.ts';
import { GraduationCap, Lock, PlayCircle, FileText } from 'lucide-react';

const Academy: React.FC = () => {
    return (
        <div className="space-y-6 animate-slide-in-up">
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-brand-primary" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Академия MatrixFlow</h2>
                            <p className="text-gray-400">Ваш путь к успеху начинается здесь. Изучайте и применяйте!</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_ACADEMY_ARTICLES.map(article => (
                        <Card key={article.id} className="!p-0 overflow-hidden group transition-all duration-300 hover:shadow-brand-primary/20 hover:-translate-y-1">
                            <div className="relative">
                                <img src={article.coverUrl} alt={article.title} className="w-full h-40 object-cover" />
                                {article.isLocked && (
                                    <div className="absolute inset-0 bg-dark-900/70 flex flex-col items-center justify-center text-center p-4">
                                        <Lock className="h-8 w-8 text-yellow-400 mb-2" />
                                        <p className="font-semibold text-white">Доступно на 5 уровне</p>
                                    </div>
                                )}
                                {!article.isLocked && (
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {article.type === 'video' ? <PlayCircle className="h-16 w-16 text-white/80" /> : <FileText className="h-16 w-16 text-white/80" />}
                                    </div>
                                )}
                                <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full text-white ${
                                    article.category === 'Для новичков' ? 'bg-blue-500' :
                                    article.category === 'Продвижение' ? 'bg-green-500' : 'bg-purple-500'
                                }`}>
                                    {article.category}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-white truncate">{article.title}</h3>
                                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                     <span>{article.type === 'video' ? 'Видео-урок' : 'Статья'}</span>
                                     {article.type === 'video' && <span>{article.duration}</span>}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Academy;
