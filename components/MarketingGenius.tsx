
import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { generateMarketingContentStream } from '../services/geminiService';
import { Sparkles, LoaderCircle } from 'lucide-react';

const MarketingGenius: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Пожалуйста, введите тему для генерации контента.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedContent('');

        try {
            await generateMarketingContentStream(prompt, (chunk) => {
                setGeneratedContent(prev => prev + chunk);
            });
        } catch (e: any) {
            setError(e.message || 'Произошла неизвестная ошибка.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const suggestionPrompts = [
        "Напиши короткий пост для Telegram о преимуществах нашего проекта",
        "Создай рекламный текст для ВКонтакте, нацеленный на студентов",
        "Придумай 3 варианта сообщений для рассылки в WhatsApp",
        "Напиши сценарий для короткого видео (Reels) о том, как работает матрица"
    ];

    return (
        <Card className="animate-slide-in-up">
            <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-brand-primary" />
                <div>
                    <h2 className="text-2xl font-bold text-white">AI-Копирайтер "Marketing Genius"</h2>
                    <p className="text-gray-400">Создавайте рекламные тексты и посты для соцсетей в один клик!</p>
                </div>
            </div>

            <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Например: 'Напиши приветственное сообщение для нового участника'"
                    className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                    rows={4}
                    disabled={isLoading}
                />
                 <div className="flex flex-wrap gap-2">
                    {suggestionPrompts.map((p, i) => (
                        <button 
                            key={i}
                            onClick={() => setPrompt(p)}
                            disabled={isLoading}
                            className="text-xs bg-dark-700 hover:bg-dark-600 text-gray-300 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <Button onClick={handleGenerate} disabled={isLoading || !process.env.API_KEY}>
                    {isLoading ? (
                        <>
                            <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                            Генерация...
                        </>
                    ) : (
                        'Сгенерировать контент'
                    )}
                </Button>
                {!process.env.API_KEY && (
                    <p className="text-yellow-500 text-sm">
                        Внимание: API ключ не предоставлен. Эта функция не будет работать.
                    </p>
                )}
                {error && <p className="text-red-500">{error}</p>}
            </div>

            {generatedContent && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Результат генерации:</h3>
                    <Card className="!bg-dark-900 max-h-96 overflow-y-auto">
                        <pre className="text-gray-300 whitespace-pre-wrap font-sans">{generatedContent}</pre>
                    </Card>
                </div>
            )}
        </Card>
    );
};

export default MarketingGenius;
