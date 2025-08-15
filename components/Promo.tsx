

import React, { useState, useEffect } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { MOCK_PROMO_MATERIALS } from '../constants.ts';
import { Megaphone, Image as ImageIcon, FileText, Download, Copy, Check, Sparkles, LoaderCircle, BrainCircuit } from 'lucide-react';
import { generateImage } from '../services/geminiService.ts';

type Tab = 'banners' | 'texts' | 'ai-generator';

const AIBannerGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadingMessages = [
        "AI анализирует ваш запрос...",
        "Создаем визуальную концепцию...",
        "Обучаем нейросеть чувству прекрасного...",
        "Генерация пикселей...",
        "Добавляем финальные штрихи...",
    ];
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let i = 0;
            const id = setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 3000);
            interval = id as any;
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Пожалуйста, опишите, что вы хотите сгенерировать.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imageB64 = await generateImage(prompt, aspectRatio); 
            setGeneratedImage(`data:image/jpeg;base64,${imageB64}`);
        } catch (e: any) {
            setError(e.message || "Произошла неизвестная ошибка при генерации.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `nexus-capital-ai-banner-${prompt.slice(0, 20).replace(/\s/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="!bg-dark-900/50 !p-0 overflow-hidden border border-dark-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* CONTROL PANEL */}
                <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-dark-700/50">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="h-6 w-6 text-brand-primary" />
                        <h3 className="text-xl font-bold text-white">Панель управления AI</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">1. Опишите баннер</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Например: 'Успешный человек работает за ноутбуком на фоне графика роста, неоновый стиль'"
                                rows={4}
                                className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">2. Соотношение сторон</label>
                            <div className="flex flex-wrap gap-2">
                                {['1:1', '16:9', '9:16'].map(ratio => (
                                    <button
                                        key={ratio}
                                        onClick={() => setAspectRatio(ratio)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-colors disabled:opacity-50 ${aspectRatio === ratio ? 'bg-brand-primary border-brand-primary text-white' : 'bg-dark-700 border-dark-600 hover:border-brand-accent'}`}
                                        disabled={isLoading}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="pt-4">
                            <Button onClick={handleGenerate} disabled={isLoading} className="w-full !py-3">
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                                        Генерация...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <Sparkles className="h-5 w-5 mr-2" />
                                        3. Сгенерировать
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* GENERATION CANVAS */}
                <div className="lg:col-span-3 p-6 min-h-[450px] flex flex-col items-center justify-center bg-dark-900/30 relative overflow-hidden">
                    {isLoading ? (
                         <div className="text-center">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping"></div>
                                <BrainCircuit className="h-12 w-12 text-brand-primary animate-pulse" />
                            </div>
                            <p className="mt-4 font-semibold text-white">{loadingMessage}</p>
                            <p className="text-xs text-gray-500 mt-1">Процесс может занять до минуты...</p>
                        </div>
                    ) : generatedImage ? (
                        <div className="w-full text-center animate-fade-in">
                            <h3 className="text-xl font-bold text-white mb-4">Результат</h3>
                            <div className="relative group">
                                <img src={generatedImage} alt="Сгенерированный баннер" className="w-full h-auto object-contain rounded-lg mb-4 max-h-80 border-2 border-dark-700 shadow-lg" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                     <Button onClick={handleDownload}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Скачать
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">
                            <div className="w-24 h-24 border-2 border-dashed border-dark-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="h-12 w-12" />
                            </div>
                            <h4 className="font-bold text-gray-400">Холст для генерации</h4>
                            <p className="text-sm">Ваш баннер появится здесь</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};


const Promo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('ai-generator');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const banners = MOCK_PROMO_MATERIALS.filter(m => m.type === 'banner');
    const texts = MOCK_PROMO_MATERIALS.filter(m => m.type === 'text');
    
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 animate-slide-in-up">
             <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Megaphone className="h-8 w-8 text-brand-primary" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Промо-материалы</h2>
                            <p className="text-gray-400">Используйте готовые материалы для привлечения партнеров.</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                 <div className="border-b border-dark-700 mb-6">
                    <nav className="-mb-px flex gap-4 overflow-x-auto">
                         <button onClick={() => setActiveTab('ai-generator')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 ${activeTab === 'ai-generator' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
                           <Sparkles className="h-5 w-5"/> AI Генератор
                        </button>
                        <button onClick={() => setActiveTab('banners')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 ${activeTab === 'banners' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
                            <ImageIcon className="h-5 w-5"/> Баннеры
                        </button>
                        <button onClick={() => setActiveTab('texts')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 ${activeTab === 'texts' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
                           <FileText className="h-5 w-5"/> Тексты
                        </button>
                    </nav>
                </div>

                {activeTab === 'ai-generator' && (
                    <AIBannerGenerator />
                )}
                
                {activeTab === 'banners' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map(banner => (
                            <Card key={banner.id} className="!bg-dark-800/50">
                                <h3 className="font-semibold text-white mb-2">{banner.title} <span className="text-sm text-gray-500">({banner.size})</span></h3>
                                <img src={banner.content} alt={banner.title} className="w-full h-auto object-cover rounded-lg mb-4" />
                                <a href={banner.content} download={`nexus-capital-promo_${banner.id}.jpg`}>
                                    <Button variant="secondary" className="w-full">
                                        <Download className="h-4 w-4 mr-2" />
                                        Скачать
                                    </Button>
                                </a>
                            </Card>
                        ))}
                    </div>
                )}
                
                {activeTab === 'texts' && (
                    <div className="space-y-6">
                        {texts.map(text => (
                            <Card key={text.id} className="!bg-dark-800/50">
                                 <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-white">{text.title}</h3>
                                    <Button variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => handleCopy(text.content, text.id)}>
                                        {copiedId === text.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 mr-1.5" />}
                                        {copiedId === text.id ? 'Скопировано!' : 'Копировать'}
                                    </Button>
                                 </div>
                                 <div className="p-4 bg-dark-900 rounded-lg max-h-60 overflow-y-auto">
                                      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">{text.content}</pre>
                                 </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Promo;