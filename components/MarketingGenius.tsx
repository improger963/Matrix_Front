
import React, { useState, useEffect } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { generateMarketingContentStream } from '../services/geminiService.ts';
import { Sparkles, LoaderCircle, Clipboard, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { MARKETING_GENIUS_TASK_ID } from '../constants.ts';

const BlinkingCursor: React.FC = () => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => setVisible(v => !v), 500);
        return () => clearInterval(interval);
    }, []);
    return visible ? <span className="inline-block w-0.5 h-5 bg-brand-accent -mb-1 ml-0.5"></span> : <span className="inline-block w-0.5 h-5 -mb-1 ml-0.5"></span>;
};

const MarketingGenius: React.FC = () => {
    const { handleCompleteTask } = useAppContext();
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Пожалуйста, введите тему для генерации контента.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedContent('');
        handleCompleteTask(MARKETING_GENIUS_TASK_ID); // Notify context that the task is completed

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
    
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                    {isLoading ? (
                        <span className="flex items-center">
                            <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                            Генерация...
                        </span>
                    ) : (
                        'Сгенерировать контент'
                    )}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
            </div>

            {(generatedContent || isLoading) && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-lg font-semibold text-white">Результат генерации:</h3>
                         {generatedContent && !isLoading && (
                            <div className="flex items-center gap-2">
                                <Button variant="secondary" onClick={handleCopy} className="!px-3 !py-1.5 text-xs">
                                    <Clipboard className="h-4 w-4 mr-1.5"/> {copied ? 'Скопировано!' : 'Копировать'}
                                </Button>
                                <Button variant="secondary" onClick={() => setGeneratedContent('')} className="!px-3 !py-1.5 text-xs">
                                     <X className="h-4 w-4 mr-1.5"/> Очистить
                                </Button>
                            </div>
                         )}
                    </div>
                    <Card className="!bg-dark-900 max-h-96 overflow-y-auto">
                        <pre className="text-gray-300 whitespace-pre-wrap font-sans">
                            {generatedContent}
                            {isLoading && <BlinkingCursor/>}
                        </pre>
                    </Card>
                </div>
            )}
        </Card>
    );
};

export default MarketingGenius;
