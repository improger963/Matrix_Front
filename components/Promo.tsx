
import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { MOCK_PROMO_MATERIALS } from '../constants.ts';
import { Megaphone, Image as ImageIcon, FileText, Download, Copy, Check } from 'lucide-react';

type Tab = 'banners' | 'texts';

const Promo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('banners');
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
                    <nav className="-mb-px flex gap-4">
                        <button onClick={() => setActiveTab('banners')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 ${activeTab === 'banners' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
                            <ImageIcon className="h-5 w-5"/> Баннеры
                        </button>
                        <button onClick={() => setActiveTab('texts')} className={`flex items-center gap-2 px-1 sm:px-4 py-3 font-semibold border-b-2 ${activeTab === 'texts' ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
                           <FileText className="h-5 w-5"/> Тексты
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'banners' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map(banner => (
                            <Card key={banner.id} className="!bg-dark-800/50">
                                <h3 className="font-semibold text-white mb-2">{banner.title} <span className="text-sm text-gray-500">({banner.size})</span></h3>
                                <img src={banner.content} alt={banner.title} className="w-full h-auto object-cover rounded-lg mb-4" />
                                <a href={banner.content} download={`matrixflow_promo_${banner.id}.jpg`}>
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
