
import React from 'react';
import Card from './ui/Card.tsx';
import { MOCK_NEWS } from '../constants.ts';
import { Newspaper } from 'lucide-react';

const News: React.FC = () => {
    return (
        <Card className="animate-slide-in-up">
            <div className="flex items-center gap-3 mb-6">
                <Newspaper className="h-8 w-8 text-brand-primary" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Новости проекта</h2>
                    <p className="text-gray-400">Следите за последними обновлениями и событиями Realty Guilds.</p>
                </div>
            </div>

            <div className="space-y-6">
                {MOCK_NEWS.map((article) => (
                    <Card key={article.id} className="!bg-dark-700/50">
                        <p className="text-sm text-gray-500 mb-2">{new Date(article.timestamp).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <h3 className="text-xl font-semibold text-white mb-3">{article.title}</h3>
                        <p className="text-gray-300 whitespace-pre-line">{article.content}</p>
                    </Card>
                ))}
            </div>
        </Card>
    );
};

export default News;
