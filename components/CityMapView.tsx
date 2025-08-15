import React, { useState, useMemo } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { Map, Zap, Building, Building2, Home, Hotel, Info, Gift, X } from 'lucide-react';
import { MOCK_CITY_DATA, MOCK_CHANCE_CARD, MOCK_CITY_EVENT } from '../constants.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import ProjectView from './ProjectView.tsx';

const districtColors: { [key: string]: { bg: string, border: string, shadow: string } } = {
    'Жилой': { bg: 'bg-blue-500/10', border: 'border-blue-500/50', shadow: 'hover:shadow-blue-500/20' },
    'Коммерческий': { bg: 'bg-purple-500/10', border: 'border-purple-500/50', shadow: 'hover:shadow-purple-500/20' },
    'Элитный': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', shadow: 'hover:shadow-yellow-500/20' },
};

const buildingIcons: { [key: number]: React.ReactNode } = {
    1: <Building2 className="w-8 h-8 text-gray-400" />,
    2: <Home className="w-8 h-8 text-cyan-400" />,
    3: <Hotel className="w-8 h-8 text-yellow-300" />,
};

const ChanceCardModal: React.FC<{ onClose: () => void; onClaim: () => void }> = ({ onClose, onClaim }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-backdrop" onClick={onClose}>
        <div className="relative" onClick={e => e.stopPropagation()}>
            <div className="w-72 h-96 bg-dark-800 border-2 border-brand-primary rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-center transform rotate-3 transition-transform hover:rotate-0 animate-pop-in">
                <Gift className="w-20 h-20 text-yellow-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white">Карта "Шанс"</h3>
                <p className="text-gray-400 mt-2 mb-6">Испытайте свою удачу и получите ежедневный бонус!</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-6">{MOCK_CHANCE_CARD.bonus}</p>
                <Button onClick={onClaim} className="w-full">Забрать награду</Button>
            </div>
             <button onClick={onClose} className="absolute -top-3 -right-3 p-2 bg-dark-900 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
    </div>
);

const CityMapView: React.FC = () => {
    const { user, addToast } = useAppContext();
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [showChanceCard, setShowChanceCard] = useState(true);

    const cityData = useMemo(() => {
        // In a real app, this would be fetched. Here, we'll process mock data.
        const syndicates = MOCK_CITY_DATA.syndicates;
        return {
            ...MOCK_CITY_DATA,
            districts: MOCK_CITY_DATA.districts.map(d => ({
                ...d,
                syndicateGuildId: syndicates.find(s => s.districtId === d.id)?.guildId,
            }))
        };
    }, []);

    const handleClaimChance = () => {
        addToast(`Вы получили бонус: ${MOCK_CHANCE_CARD.bonus}!`, 'success');
        setShowChanceCard(false);
    };

    if (selectedProject) {
        return <ProjectView />;
    }

    return (
        <div className="flex flex-col h-full">
            {showChanceCard && <ChanceCardModal onClose={() => setShowChanceCard(false)} onClaim={handleClaimChance} />}

            <Card className="flex-shrink-0 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Map className="h-8 w-8 text-brand-primary" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Карта Метрополиса</h2>
                            <p className="text-gray-400">Стройте свою империю, район за районом.</p>
                        </div>
                    </div>
                    {MOCK_CITY_EVENT.isActive && (
                        <div className="w-full md:w-auto p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/50 flex items-center gap-3">
                            <Zap className="h-6 w-6 text-yellow-400" />
                            <div>
                                <h3 className="font-semibold text-yellow-300">{MOCK_CITY_EVENT.title}</h3>
                                <p className="text-xs text-yellow-400/80">{MOCK_CITY_EVENT.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {cityData.districts.map(district => (
                    <Card key={district.id} className={`
                        !p-4 transition-all duration-300 
                        ${districtColors[district.name]?.bg || 'bg-gray-500/10'}
                        ${districtColors[district.name]?.border || 'border-gray-500/50'}
                        ${districtColors[district.name]?.shadow || ''}
                        ${district.syndicateGuildId ? '!border-green-400 animate-card-glow' : ''}
                    `}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">{district.name}</h3>
                            {district.syndicateGuildId && (
                                <div className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                                    СИНДИКАТ: {cityData.guilds.find(g => g.id === district.syndicateGuildId)?.name}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {district.projects.map(project => (
                                <button 
                                    key={project.id}
                                    onClick={() => project.ownerId === user.id && addToast("Загрузка вашего проекта... Навигация в разработке.", "info")}
                                    className={`
                                        aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all
                                        ${project.ownerId === user.id ? 'bg-brand-primary/20 border-brand-primary cursor-pointer hover:bg-brand-primary/30' : 
                                         project.ownerId ? 'bg-dark-700/50 border-dark-600' : 'bg-dark-900/50 border-dashed border-dark-600 hover:border-brand-accent cursor-pointer'}
                                    `}
                                    title={project.ownerId === user.id ? "Ваш проект" : project.ownerId ? `Проект гильдии ${cityData.guilds.find(g => g.id === project.guildId)?.name}` : "Свободный участок"}
                                >
                                    {buildingIcons[project.upgradeLevel]}
                                    <p className="text-xs font-semibold mt-2">
                                        {project.ownerId === user.id ? "Мой проект" : project.ownerId ? "Занято" : "Свободно"}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CityMapView;