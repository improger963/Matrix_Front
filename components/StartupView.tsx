
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { MOCK_STARTUP_DATA, MOCK_SYNDICATE_MEMBERS } from '../constants.ts';
import type { StartupNode as StartupNodeType, SyndicateMember } from '../types.ts';
import * as htmlToImage from 'html-to-image';
import { User, ShieldPlus, Link, Check, ChevronRight, Search, Maximize, Minimize, AlertCircle, Users as UsersIcon, Network, Download, X, BarChart, BarChart3, FlaskConical, BrainCircuit, HeartPulse, Lightbulb, HelpingHand, Target, XCircle, TrendingUp, PieChart, DollarSign } from 'lucide-react';
import AnalyticsPanel from './AnalyticsPanel.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

// --- Local Components ---

const SimulationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (member: SyndicateMember | { id: string, name: string, avatarUrl: string } | null) => void;
}> = ({ isOpen, onClose, onSelect }) => {
    const inactiveMembers = MOCK_SYNDICATE_MEMBERS.filter(m => m.status === 'inactive');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-backdrop" onClick={onClose}>
            <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md p-6 animate-pop-in" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Выберите инвестора для симуляции</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    <button onClick={() => onSelect({ id: 'VIRTUAL_1', name: 'Новый инвестор', avatarUrl: 'https://i.pravatar.cc/150?u=VIRTUAL' })} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-dark-700 transition-colors text-left">
                        <User className="w-10 h-10 p-2 bg-dark-900 rounded-full text-gray-400" />
                        <div>
                            <p className="font-semibold text-white">Новый инвестор</p>
                            <p className="text-xs text-gray-500">Симулировать нового партнера</p>
                        </div>
                    </button>
                    {inactiveMembers.map(member => (
                        <button key={member.id} onClick={() => onSelect(member)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-dark-700 transition-colors text-left">
                            <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-white">{member.name}</p>
                                <p className="text-xs text-gray-500">Неактивен с {new Date(member.joinDate).toLocaleDateString()}</p>
                            </div>
                        </button>
                    ))}
                </div>
                 <button onClick={onClose} className="w-full mt-4 text-center text-sm text-gray-400 hover:text-white">Отмена</button>
            </div>
        </div>
    );
};

// --- Startup Node Component ---

interface StartupNodeProps {
    node: StartupNodeType;
    depth: number;
    isRoot: boolean;
    referralLink: string;
    onNodeClick: (node: StartupNodeType) => void;
    highlightedPath: string[];
    hoveredNodeId: string | null;
    onNodeHover: (nodeId: string | null) => void;
    parentNodeId: string | null;
    isHealthMapMode: boolean;
    aiSuggestion?: { reason: string; type: string };
    isSimulationMode: boolean;
    onStartSimulation: (node: StartupNodeType) => void;
    aiSuggestions: any[];
}

const MemoizedStartupNode: React.FC<StartupNodeProps> = React.memo((props) => {
    const { node, depth, isRoot, referralLink, onNodeClick, highlightedPath, hoveredNodeId, onNodeHover, parentNodeId, isHealthMapMode, aiSuggestion, isSimulationMode, onStartSimulation } = props;
    const [copied, setCopied] = useState(false);
    
    const nodeSize = isRoot ? 'w-28 h-28' : 'w-24 h-24';
    const avatarSize = isRoot ? 'w-16 h-16' : 'w-14 h-14';
    const isNavigable = node.isFilled && !isRoot;

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSimulationMode && !node.isFilled) {
            onStartSimulation(node);
        } else if (isNavigable) {
            onNodeClick(node);
        } else if (!node.isFilled) {
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [isSimulationMode, isNavigable, node, onNodeClick, referralLink, onStartSimulation]);
    
    const isPathHighlighted = highlightedPath.includes(node.id);
    const isHovered = hoveredNodeId === node.id || hoveredNodeId === parentNodeId || (node.children?.some(c => c.id === hoveredNodeId) ?? false);

    const typeColorClasses: Record<string, string> = { self: 'border-purple-500', syndicate_deal: 'border-cyan-400', spinoff: 'border-orange-400' };
    const nodeBorderColor = node.isFilled ? (isRoot ? 'border-brand-primary' : typeColorClasses[node.nodeType || ''] || 'border-dark-600') : 'border-dark-600 border-dashed';
    
    const filledTooltipContent = (
        <div className="p-2 space-y-1.5 text-xs text-left">
            <p className="font-bold text-white">{node.name}</p>
            <div className="flex items-center gap-1.5"><User className="h-3 w-3" /> Уровень: {node.level}</div>
            <div className="flex items-center gap-1.5"><UsersIcon className="h-3 w-3" /> Инвесторы: {node.investors}</div>
            <div className="flex items-center gap-1.5"><Network className="h-3 w-3" /> В структуре: {node.downline}</div>
            {!isRoot && <div className="pt-1.5 border-t border-dark-600 mt-1.5 w-full flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Нажмите, чтобы перейти</div>}
        </div>
    );

    const emptyTooltipContent = isSimulationMode
        ? <span className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4" /> Начать симуляцию</span>
        : copied
        ? <span className="flex items-center gap-1.5 text-accent-green"><Check className="h-4 w-4" /> Скопировано!</span>
        : <span className="flex items-center gap-1.5"><Link className="h-4 w-4" /> Пригласить инвестора</span>;
    
    const suggestionIcons = { fast: <Target className="h-5 w-5 text-red-400" />, team: <HelpingHand className="h-5 w-5 text-cyan-400" />, strategic: <Lightbulb className="h-5 w-5 text-yellow-400" /> };
    
    const healthColorClasses: Record<string, string> = { low: 'stroke-green-500', medium: 'stroke-yellow-500', high: 'stroke-red-500' };

    return (
        <div className="flex flex-col items-center relative" onMouseEnter={() => node.isFilled && onNodeHover(node.id)} onMouseLeave={() => node.isFilled && onNodeHover(null)}>
            <div className={`group relative flex items-center justify-center rounded-full p-1 transition-all duration-300 ${isHovered ? 'bg-dark-700/50' : ''}`}>
                 <button
                    onClick={handleClick}
                    className={`relative flex flex-col items-center justify-center bg-dark-800 rounded-full border-4 shadow-lg transition-all duration-300
                    ${nodeSize} ${nodeBorderColor} 
                    ${isPathHighlighted ? 'scale-110 !border-brand-primary shadow-brand-primary/40' : 'hover:scale-105'}
                    ${isSimulationMode && !node.isFilled ? 'border-dashed border-yellow-400 animate-pulse' : ''}
                    ${aiSuggestion ? 'animate-glow ring-2 ring-offset-2 ring-offset-dark-800 ring-yellow-400' : ''}
                    `}
                    aria-label={node.isFilled ? `Информация о ${node.name}` : 'Свободное место'}
                >
                    <div className="absolute inset-0 bg-dark-800 rounded-full transition-opacity opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                        <div className="absolute z-20 -top-2 left-1/2 -translate-x-1/2 translate-y-[-100%] bg-dark-900 border border-dark-600 rounded-lg shadow-lg p-0 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none">
                            {node.isFilled ? filledTooltipContent : emptyTooltipContent}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-900 transform rotate-45 border-r border-b border-dark-600"></div>
                        </div>
                    </div>

                    {node.isFilled ? (
                        <>
                            <img src={node.avatarUrl} alt={node.name} className={`${avatarSize} rounded-full object-cover mb-1`} />
                            <p className="text-xs font-bold text-white truncate w-20">{node.name}</p>
                        </>
                    ) : (
                        <ShieldPlus className={`h-8 w-8 transition-colors ${isSimulationMode ? 'text-yellow-400' : 'text-gray-600'}`} />
                    )}
                </button>
                {aiSuggestion && (
                    <div className="absolute -top-2 -right-2 z-10 p-1.5 bg-dark-800 rounded-full group">
                        {suggestionIcons[aiSuggestion.type as keyof typeof suggestionIcons]}
                         <div className="absolute z-20 -top-2 left-1/2 -translate-x-1/2 translate-y-[-100%] bg-dark-900 border border-dark-600 rounded-lg shadow-lg p-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs text-white w-48 text-center">
                            {aiSuggestion.reason}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-900 transform rotate-45 border-r border-b border-dark-600"></div>
                        </div>
                    </div>
                )}
            </div>

            {node.children && node.children.length > 0 && (
                <>
                    <div className="absolute top-full w-full h-10 pointer-events-none">
                       <svg viewBox={`0 0 ${isRoot ? 400 : 360} 40`} className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#2dd4bf', stopOpacity: 1 }} />
                            </linearGradient>
                          </defs>
                          {node.children.map((child, index) => {
                            const isChildHovered = hoveredNodeId === child.id || hoveredNodeId === node.id;
                            const svgWidth = isRoot ? 400 : 360;
                            const startX = svgWidth / 2;
                            const endX = (svgWidth / 4) + (index * (svgWidth / 2));
                            const pathD = `M ${startX} 0 Q ${startX} 20, ${endX} 20 T ${endX} 40`;
                            const healthClass = child.isFilled ? (healthColorClasses[child.riskLevel || ''] || 'stroke-gray-600') : 'stroke-gray-600';
                            
                            return (
                                <path 
                                    key={child.id} d={pathD}
                                    stroke={isHealthMapMode ? undefined : 'url(#line-gradient)'} 
                                    strokeWidth={isChildHovered ? 4 : 2} fill="none" strokeLinecap="round" strokeDasharray="10 10"
                                    className={`transition-all duration-300 ${isChildHovered ? 'opacity-100' : 'opacity-40'} animate-flow-line ${isHealthMapMode ? healthClass : ''}`}
                                />
                            )
                          })}
                       </svg>
                    </div>
                    <div className="mt-10 flex justify-center relative gap-16 md:gap-24">
                        {node.children.map((child) => (
                           <MemoizedStartupNode {...{ ...props, key: child.id, node: child, depth: depth + 1, isRoot: false, parentNodeId: node.id, aiSuggestion: props.aiSuggestions.find((s: any) => s.nodeId === child.id) }} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});

// --- Main View Component ---

const StartupView: React.FC = () => {
    const { user, addToast } = useAppContext();
    const [history, setHistory] = useState<StartupNodeType[]>([MOCK_STARTUP_DATA]);
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
    const [isAnalyticsPanelOpen, setAnalyticsPanelOpen] = useState(false);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    
    // New state for advanced tools
    const [isHealthMapMode, setHealthMapMode] = useState(false);
    const [isSimulationMode, setSimulationMode] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
    const [simulatingSlot, setSimulatingSlot] = useState<StartupNodeType | null>(null);
    const [simulationResult, setSimulationResult] = useState<{ tempMatrix: StartupNodeType, effects: string[] } | null>(null);

    // Game mechanics state
    const [currentStartupState, setCurrentStartupState] = useState(MOCK_STARTUP_DATA);
    const { fundingStage } = currentStartupState;
    const filledSlots = (currentStartupState.downline || 0) + 1;


    const matrixViewportRef = useRef<HTMLDivElement>(null);
    const matrixContentRef = useRef<HTMLDivElement>(null);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    
    const currentNode = history[history.length - 1];
    
    // --- Memos & Effects ---
    
    const matrixWithHealth = useMemo(() => {
        const calculateHealth = (node: StartupNodeType): StartupNodeType['riskLevel'] => {
            if (!node.isFilled) return undefined;
            
            const activityDates = (node.children || []).map(c => c.isFilled && c.lastActivityDate ? new Date(c.lastActivityDate).getTime() : 0).filter(d => d > 0);
            if(node.lastActivityDate) activityDates.push(new Date(node.lastActivityDate).getTime());

            if (activityDates.length === 0) return 'high';
            
            const mostRecentActivity = Math.max(...activityDates);
            const daysSinceActivity = (Date.now() - mostRecentActivity) / (1000 * 3600 * 24);

            if (daysSinceActivity <= 7) return 'low';
            if (daysSinceActivity <= 21) return 'medium';
            return 'high';
        };
        
        const traverse = (node: StartupNodeType): StartupNodeType => {
            const newNode = { ...node };
            if (newNode.children) {
                newNode.children = newNode.children.map(traverse);
            }
            newNode.riskLevel = calculateHealth(newNode);
            return newNode;
        };
        return traverse(JSON.parse(JSON.stringify(currentNode)));
    }, [currentNode]);

    const displayedMatrix = simulationResult?.tempMatrix || (isHealthMapMode ? matrixWithHealth : currentStartupState);

    // --- Handlers ---
    
    const resetModes = useCallback((keepSimulation = false) => {
        setHealthMapMode(false);
        setAiSuggestions([]);
        if (!keepSimulation) {
            setSimulationMode(false);
            setSimulationResult(null);
        }
    }, []);

    const handleUpgrade = (level: 2 | 3) => {
        setCurrentStartupState(prev => ({...prev, fundingStage: level}));
        const upgradeName = level === 2 ? "Раунд А" : "Раунд B";
        addToast(`Стартап перешел на "${upgradeName}"!`, 'success');
    };

    const handleNodeClick = useCallback((node: StartupNodeType) => {
        if (node.isFilled) {
            setHistory(prev => [...prev, node]);
            setCurrentStartupState(node);
            setTransform({ x: 0, y: 0, scale: 1 });
            resetModes();
        }
    }, [resetModes]);

    const handleBreadcrumbClick = useCallback((index: number) => {
        const newHistory = history.slice(0, index + 1);
        setHistory(newHistory);
        setCurrentStartupState(newHistory[newHistory.length - 1]);
        setTransform({ x: 0, y: 0, scale: 1 });
        resetModes();
    }, [history, resetModes]);

    const handleGetAiSuggestions = () => {
        resetModes();
        if (aiSuggestions.length > 0) {
            setAiSuggestions([]);
        } else {
             addToast('AI анализирует вашу структуру...', 'info');
             setTimeout(() => {
                setAiSuggestions([
                    { nodeId: "UCHILD6", reason: "Быстрая прибыль: Закрытие этого слота завершит второй уровень, принося максимальный доход.", type: "fast" },
                    { nodeId: "UCHILD2", reason: "Помощь синдикату: Усилит активную ветку Марии С., ускоряя ее прогресс.", type: "team" },
                    { nodeId: "UCHILD5", reason: "Стратегический ход: Открывает новую сильную ветку для диверсификации.", type: "strategic" },
                ]);
                addToast('AI-Аналитик готов! Оптимальные места подсвечены.', 'success');
            }, 1500);
        }
    };
    
    const handleStartSimulation = (node: StartupNodeType) => {
        setSimulatingSlot(node);
    };

    const handleSelectPlacement = (member: SyndicateMember | { id: string, name: string, avatarUrl: string } | null) => {
        if (!member || !simulatingSlot) {
            setSimulatingSlot(null);
            return;
        }

        const newMatrix = JSON.parse(JSON.stringify(currentNode));
        const findAndReplace = (node: StartupNodeType): boolean => {
             if (node.id === simulatingSlot.id) {
                Object.assign(node, {
                    isFilled: true,
                    id: member.id,
                    name: member.name,
                    avatarUrl: member.avatarUrl,
                    nodeType: 'self',
                    level: (member as SyndicateMember).level || 1,
                    investors: (member as SyndicateMember).investors || 0,
                    joinDate: new Date().toISOString(),
                    lastActivityDate: new Date().toISOString(),
                    children: [{ id: 'EMPTY_L', name: 'Свободно', avatarUrl: '', isFilled: false, fundingStage: 1, industry: 'Fintech' }, { id: 'EMPTY_R', name: 'Свободно', avatarUrl: '', isFilled: false, fundingStage: 1, industry: 'Fintech' }]
                });
                return true;
            }
            if (node.children) {
                for(const child of node.children) {
                    if (findAndReplace(child)) return true;
                }
            }
            return false;
        };
        findAndReplace(newMatrix);

        setSimulationResult({
            tempMatrix: newMatrix,
            effects: [
                `Вы получаете $500 CAP прибыли.`,
                `Ваш партнер 'Мария С.' получает 'Сделку из синдиката'.`,
                `Осталось 1 место до Exit и получения бонуса $2000 CAP.`
            ]
        });
        setSimulatingSlot(null);
    };
    
    const handleExitSimulation = () => {
        setSimulationMode(false);
        setSimulationResult(null);
    };

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !matrixViewportRef.current) return;
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }, [isDragging]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (!matrixViewportRef.current) return;
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        setTransform(prev => ({
            ...prev,
            scale: Math.min(Math.max(0.2, prev.scale + scaleAmount), 2)
        }));
    }, []);
    
    const findNodeById = (node: StartupNodeType, id: string): StartupNodeType | null => {
        if (node.id === id) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNodeById(child, id);
                if (found) return found;
            }
        }
        return null;
    };
    
    const findPathToNode = (node: StartupNodeType, id: string, path: string[] = []): string[] | null => {
        if (node.id === id) return [...path, node.id];
        if (node.children) {
            for (const child of node.children) {
                const foundPath = findPathToNode(child, id, [...path, node.id]);
                if (foundPath) return foundPath;
            }
        }
        return null;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchError(null);
        setHighlightedPath([]);
        if (!searchQuery.trim()) return;

        const targetNode = findNodeById(MOCK_STARTUP_DATA, searchQuery.trim());
        if (targetNode) {
            const path = findPathToNode(MOCK_STARTUP_DATA, searchQuery.trim());
            if(path) {
                setHistory([MOCK_STARTUP_DATA]);
                setHighlightedPath(path);
            }
        } else {
            setSearchError(`Инвестор с ID "${searchQuery}" не найден в вашей структуре.`);
        }
    };
    
    const handleExport = () => {
        if (matrixContentRef.current === null) {
            addToast('Ошибка: не удалось найти элемент для экспорта.', 'error');
            return;
        }
        addToast('Начинаем экспорт...', 'info');
        htmlToImage.toPng(matrixContentRef.current, { 
                backgroundColor: '#0f172a',
                pixelRatio: window.devicePixelRatio || 1, 
            })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `startup-snapshot-${currentNode.id}.png`;
                link.href = dataUrl;
                link.click();
                addToast('Снимок стартапа успешно экспортирован!', 'success');
            })
            .catch((err) => {
                console.error('Startup export failed:', err);
                addToast('Не удалось экспортировать стартап! Проверьте консоль.', 'error');
            });
    };

    return (
        <Card className="animate-slide-in-up flex flex-col h-full !p-0 md:!p-4 overflow-hidden">
            <div className="p-4 border-b border-dark-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <div className="flex items-center flex-wrap gap-x-2">
                        {history.map((node, index) => (
                            <React.Fragment key={node.id}>
                                <button onClick={() => handleBreadcrumbClick(index)} className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1">
                                    {index === 0 ? <BarChart className="h-4 w-4" /> : null}
                                    {node.name}
                                </button>
                                {index < history.length - 1 && <ChevronRight className="h-4 w-4 text-gray-600" />}
                            </React.Fragment>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Просмотр структуры для инвестора: {currentNode.name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={handleExport} className="!px-3 !py-1.5"><Download className="h-4 w-4"/></Button>
                    <Button variant="secondary" onClick={() => setAnalyticsPanelOpen(true)} className="!px-3 !py-1.5"><BarChart3 className="h-4 w-4"/></Button>
                    <Button variant="secondary" onClick={() => setIsFullscreen(!isFullscreen)} className="!px-3 !py-1.5">{isFullscreen ? <Minimize className="h-4 w-4"/> : <Maximize className="h-4 w-4"/>}</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4">
                <div className="xl:col-span-2">
                    <form onSubmit={handleSearch} className="flex-grow w-full flex items-center gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск по ID инвестора..." className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"/>
                        </div>
                        <Button type="submit">Найти</Button>
                    </form>
                </div>
                <div className="xl:col-span-1 flex items-center gap-2 p-2 bg-dark-800 rounded-lg border border-dark-700 w-full justify-center">
                    <button onClick={() => { resetModes(); setHealthMapMode(p => !p); }} className={`px-3 py-1.5 text-xs rounded-md flex items-center transition-colors ${isHealthMapMode ? 'bg-brand-primary text-white' : 'hover:bg-dark-600'}`}>
                        <HeartPulse className="h-4 w-4 mr-1.5"/>Анализ рисков
                    </button>
                    <button onClick={handleGetAiSuggestions} className={`px-3 py-1.5 text-xs rounded-md flex items-center transition-colors ${aiSuggestions.length > 0 ? 'bg-brand-primary text-white' : 'hover:bg-dark-600'}`}>
                        <BrainCircuit className="h-4 w-4 mr-1.5"/>AI-Аналитик
                    </button>
                    <button onClick={() => { resetModes(isSimulationMode); setSimulationMode(p => !p); }} className={`px-3 py-1.5 text-xs rounded-md flex items-center transition-colors ${isSimulationMode ? 'bg-brand-primary text-white' : 'hover:bg-dark-600'}`}>
                        <FlaskConical className="h-4 w-4 mr-1.5"/>Симулятор
                    </button>
                </div>
            </div>
            
            {searchError && <div className="mx-4 mb-2 text-xs text-red-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" />{searchError}</div>}
            
            {simulationResult && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50 mb-4 text-center mx-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-yellow-300">РЕЖИМ СИМУЛЯЦИИ</h4>
                        <button onClick={handleExitSimulation} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"><XCircle className="h-4 w-4"/>Выйти</button>
                    </div>
                    <ul className="text-sm text-yellow-200 mt-2 list-disc list-inside text-left">
                        {simulationResult.effects.map((effect, i) => <li key={i}>{effect}</li>)}
                    </ul>
                </div>
            )}
            
            <div 
                ref={matrixViewportRef} 
                className="flex-1 w-full h-full relative overflow-hidden bg-dark-900/50 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
            >
                 <div className="absolute top-4 left-4 z-10">
                    <Card className="!p-3">
                        <h4 className="text-sm font-bold text-white mb-2">Управление Стартапом</h4>
                        <div className="text-xs text-gray-400 mb-3">
                            <p>Стадия: <span className={`font-semibold ${fundingStage === 1 ? 'text-gray-300' : fundingStage === 2 ? 'text-cyan-400' : 'text-yellow-400'}`}>
                                {fundingStage === 1 ? 'Pre-seed' : fundingStage === 2 ? 'Раунд А' : 'Раунд B'}
                            </span></p>
                            <p>Бонус к прибыли: <span className="font-semibold text-accent-green">{fundingStage > 1 ? '+25%' : 'Стандарт' }</span></p>
                            <p>Бонус за Exit: <span className="font-semibold text-accent-green">{fundingStage > 2 ? '+50%' : 'Стандарт' }</span></p>
                        </div>
                        <div className="space-y-2">
                            <Button onClick={() => handleUpgrade(2)} disabled={fundingStage >= 2 || filledSlots < 3} variant="secondary" className="w-full !text-xs !py-1.5">
                                <TrendingUp className="w-4 h-4 mr-1.5"/>Перейти к Раунду А
                            </Button>
                            <Button onClick={() => handleUpgrade(3)} disabled={fundingStage >= 3 || filledSlots < 6} variant="secondary" className="w-full !text-xs !py-1.5">
                                <PieChart className="w-4 h-4 mr-1.5"/>Перейти к Раунду B
                            </Button>
                             <p className="text-[10px] text-gray-500 text-center pt-1">
                                {fundingStage === 1 && filledSlots < 3 ? `Нужно ${3 - filledSlots} инвестора для Раунда А` : ''}
                                {fundingStage === 2 && filledSlots < 6 ? `Нужно ${6 - filledSlots} инвестора для Раунда B` : ''}
                            </p>
                        </div>
                    </Card>
                </div>
                <div 
                    ref={matrixContentRef} 
                    className="p-12 transition-transform duration-200 ease-out"
                    style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
                >
                    <MemoizedStartupNode
                        node={displayedMatrix}
                        depth={0}
                        isRoot={true}
                        referralLink={user.referralLink}
                        onNodeClick={handleNodeClick}
                        highlightedPath={highlightedPath}
                        hoveredNodeId={hoveredNodeId}
                        onNodeHover={setHoveredNodeId}
                        parentNodeId={null}
                        isHealthMapMode={isHealthMapMode}
                        isSimulationMode={isSimulationMode}
                        onStartSimulation={handleStartSimulation}
                        aiSuggestions={aiSuggestions}
                        aiSuggestion={aiSuggestions.find(s => s.nodeId === displayedMatrix.id)}
                    />
                </div>
            </div>
            
            <AnalyticsPanel node={currentNode} isOpen={isAnalyticsPanelOpen} onClose={() => setAnalyticsPanelOpen(false)} />
            <SimulationModal isOpen={!!simulatingSlot} onClose={() => setSimulatingSlot(null)} onSelect={handleSelectPlacement} />
        </Card>
    );
};

export default StartupView;