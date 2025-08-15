
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { MOCK_STARTUP_DATA as MOCK_PROJECT_DATA, MOCK_SYNDICATE_MEMBERS as MOCK_NETWORK_MEMBERS } from '../constants.ts';
import type { ProjectNode as ProjectNodeType, Partner } from '../types.ts';
import * as htmlToImage from 'html-to-image';
import { User, ShieldPlus, Link, Check, ChevronRight, Search, Maximize, Minimize, AlertCircle, Users as UsersIcon, Network, Download, X, BarChart, BarChart3, FlaskConical, BrainCircuit, HeartPulse, Lightbulb, HelpingHand, Target, XCircle, TrendingUp, PieChart, DollarSign, Rocket } from 'lucide-react';
import AnalyticsPanel from './AnalyticsPanel.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

// --- Local Components ---

const SimulationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (member: Partner | { id: string, name: string, avatarUrl: string } | null) => void;
}> = ({ isOpen, onClose, onSelect }) => {
    const inactiveMembers = MOCK_NETWORK_MEMBERS.filter(m => m.status === 'inactive');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-backdrop" onClick={onClose}>
            <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md p-6 animate-pop-in" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Выберите партнера для симуляции</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    <button onClick={() => onSelect({ id: 'VIRTUAL_1', name: 'Новый партнер', avatarUrl: 'https://i.pravatar.cc/150?u=VIRTUAL' })} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-dark-700 transition-colors text-left">
                        <User className="w-10 h-10 p-2 bg-dark-900 rounded-full text-gray-400" />
                        <div>
                            <p className="font-semibold text-white">Новый партнер</p>
                            <p className="text-xs text-gray-500">Симулировать нового партнера</p>
                        </div>
                    </button>
                    {inactiveMembers.map(member => (
                        <button key={member.id} onClick={() => onSelect(member)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-dark-700 transition-colors text-left">
                            <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
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

// --- Project Node Component ---

interface ProjectNodeProps {
    node: ProjectNodeType;
    depth: number;
    isRoot: boolean;
    referralLink: string;
    onNodeClick: (node: ProjectNodeType) => void;
    highlightedPath: string[];
    hoveredNodeId: string | null;
    onNodeHover: (nodeId: string | null) => void;
    parentNodeId: string | null;
    isHealthMapMode: boolean;
    aiSuggestion?: { reason: string; type: string };
    isSimulationMode: boolean;
    onStartSimulation: (node: ProjectNodeType) => void;
    aiSuggestions: any[];
}

const MemoizedProjectNode: React.FC<ProjectNodeProps> = React.memo((props) => {
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
            <div className="flex items-center gap-1.5"><UsersIcon className="h-3 w-3" /> В команде: {node.investors}</div>
            <div className="flex items-center gap-1.5"><Network className="h-3 w-3" /> В структуре: {node.downline}</div>
            {!isRoot && <div className="pt-1.5 border-t border-dark-600 mt-1.5 w-full flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Нажмите, чтобы перейти</div>}
        </div>
    );

    const emptyTooltipContent = isSimulationMode
        ? <span className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4" /> Начать симуляцию</span>
        : copied
        ? <span className="flex items-center gap-1.5 text-accent-green"><Check className="h-4 w-4" /> Скопировано!</span>
        : <span className="flex items-center gap-1.5"><Link className="h-4 w-4" /> Продать Долю</span>;
    
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
                    aria-label={node.isFilled ? `Информация о ${node.name}` : 'Свободная Доля'}
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
                           <MemoizedProjectNode {...{ ...props, key: child.id, node: child, depth: depth + 1, isRoot: false, parentNodeId: node.id, aiSuggestion: props.aiSuggestions.find((s: any) => s.nodeId === child.id) }} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});


// --- Main View Component ---

const ProjectView: React.FC = () => {
    const { user, addToast, portfolio, activateFirstProject } = useAppContext();
    const [history, setHistory] = useState<ProjectNodeType[]>([MOCK_PROJECT_DATA]);
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState<string | null>(null);
    const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
    const [isAnalyticsPanelOpen, setAnalyticsPanelOpen] = useState(false);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [isToolsPanelOpen, setToolsPanelOpen] = useState(false);
    
    // New state for advanced tools
    const [isHealthMapMode, setHealthMapMode] = useState(false);
    const [isSimulationMode, setSimulationMode] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
    const [simulatingSlot, setSimulatingSlot] = useState<ProjectNodeType | null>(null);
    const [simulationResult, setSimulationResult] = useState<{ tempMatrix: ProjectNodeType, effects: string[] } | null>(null);

    const [currentProjectState, setCurrentProjectState] = useState(MOCK_PROJECT_DATA);
    const { fundingStage } = currentProjectState;
    const filledSlots = (currentProjectState.downline || 0) + 1;


    const matrixViewportRef = useRef<HTMLDivElement>(null);
    const matrixContentRef = useRef<HTMLDivElement>(null);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    
    const currentNode = history[history.length - 1];
    
    // --- Memos & Effects ---
    
    const matrixWithHealth = useMemo(() => {
        const calculateHealth = (node: ProjectNodeType): ProjectNodeType['riskLevel'] => {
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
        
        const traverse = (node: ProjectNodeType): ProjectNodeType => {
            const newNode = { ...node };
            if (newNode.children) {
                newNode.children = newNode.children.map(traverse);
            }
            newNode.riskLevel = calculateHealth(newNode);
            return newNode;
        };
        return traverse(JSON.parse(JSON.stringify(currentNode)));
    }, [currentNode]);

    const displayedMatrix = simulationResult?.tempMatrix || (isHealthMapMode ? matrixWithHealth : currentProjectState);

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
        setCurrentProjectState(prev => ({...prev, fundingStage: level}));
        const upgradeName = level === 2 ? "Раунд А" : "Раунд B";
        addToast(`Проект перешел на "${upgradeName}"!`, 'success');
    };

    const handleNodeClick = useCallback((node: ProjectNodeType) => {
        if (node.isFilled) {
            setHistory(prev => [...prev, node]);
            setCurrentProjectState(node);
            setTransform({ x: 0, y: 0, scale: 1 });
            resetModes();
        }
    }, [resetModes]);

    const handleBreadcrumbClick = useCallback((index: number) => {
        const newHistory = history.slice(0, index + 1);
        setHistory(newHistory);
        setCurrentProjectState(newHistory[newHistory.length - 1]);
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
                    { nodeId: "UCHILD6", reason: "Быстрая Прибыль: Заполнение этой Доли завершит второй уровень, принося максимальный доход.", type: "fast" },
                    { nodeId: "UCHILD2", reason: "Помощь Бизнес-сети: Усилит активную ветку Марии С., ускоряя ее прогресс.", type: "team" },
                    { nodeId: "UCHILD5", reason: "Стратегический ход: Открывает новую сильную ветку для диверсификации.", type: "strategic" },
                ]);
                addToast('AI-Аналитик готов! Оптимальные Доли подсвечены.', 'success');
            }, 1500);
        }
    };
    
    const handleStartSimulation = (node: ProjectNodeType) => {
        setSimulatingSlot(node);
    };

    const handleSelectPlacement = (member: Partner | { id: string, name: string, avatarUrl: string } | null) => {
        if (!member || !simulatingSlot) {
            setSimulatingSlot(null);
            return;
        }

        const newMatrix = JSON.parse(JSON.stringify(currentNode));
        const findAndReplace = (node: ProjectNodeType): boolean => {
             if (node.id === simulatingSlot.id) {
                Object.assign(node, {
                    isFilled: true,
                    id: member.id,
                    name: member.name,
                    avatarUrl: member.avatarUrl,
                    nodeType: 'self',
                    level: (member as Partner).level || 1,
                    investors: (member as Partner).investors || 0,
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
                `Вы получаете $500 CAP Прибыли.`,
                `Ваш партнер 'Мария С.' получает 'Транш от Бизнес-сети'.`,
                `Осталась 1 Доля до Полного Финансирования и получения бонуса $2000 CAP.`
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
    
    const findNodeById = (node: ProjectNodeType, id: string): ProjectNodeType | null => {
        if (node.id === id) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNodeById(child, id);
                if (found) return found;
            }
        }
        return null;
    };
    
    const findPathToNode = (node: ProjectNodeType, id: string, path: string[] = []): string[] | null => {
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

        const targetNode = findNodeById(MOCK_PROJECT_DATA, searchQuery.trim());
        if (targetNode) {
            const path = findPathToNode(MOCK_PROJECT_DATA, searchQuery.trim());
            if(path) {
                setHistory([MOCK_PROJECT_DATA]);
                setHighlightedPath(path);
            }
        } else {
            setSearchError(`Партнер с ID "${searchQuery}" не найден в вашей структуре.`);
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
                link.download = `project-snapshot-${currentNode.id}.png`;
                link.href = dataUrl;
                link.click();
                addToast('Снимок проекта успешно экспортирован!', 'success');
            })
            .catch((err) => {
                console.error('Project export failed:', err);
                addToast('Не удалось экспортировать проект! Проверьте консоль.', 'error');
            });
    };
    
    const ToolsPanelContent = () => (
         <>
            <div className="p-4 border-b border-dark-700/50">
                <form onSubmit={handleSearch} className="flex-grow w-full flex items-center gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск по ID партнера..." className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"/>
                    </div>
                    <Button type="submit" className="!px-3 !py-2"><Search className="h-4 w-4"/></Button>
                </form>
                {searchError && <div className="mt-2 text-xs text-red-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" />{searchError}</div>}
            </div>
            <div className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Стратегический оверлей</h3>
                 <button onClick={() => { resetModes(); setHealthMapMode(p => !p); }} className={`w-full text-left p-3 text-sm rounded-md flex items-center transition-colors ${isHealthMapMode ? 'bg-brand-primary/20 text-brand-primary' : 'hover:bg-dark-600'}`}>
                    <HeartPulse className="h-5 w-5 mr-3"/>Анализ рисков
                </button>
                <button onClick={handleGetAiSuggestions} className={`w-full text-left p-3 text-sm rounded-md flex items-center transition-colors ${aiSuggestions.length > 0 ? 'bg-brand-primary/20 text-brand-primary' : 'hover:bg-dark-600'}`}>
                    <BrainCircuit className="h-5 w-5 mr-3"/>AI-Аналитик
                </button>
                <button onClick={() => { resetModes(isSimulationMode); setSimulationMode(p => !p); }} className={`w-full text-left p-3 text-sm rounded-md flex items-center transition-colors ${isSimulationMode ? 'bg-brand-primary/20 text-brand-primary' : 'hover:bg-dark-600'}`}>
                    <FlaskConical className="h-5 w-5 mr-3"/>Симулятор
                </button>
            </div>
            <div className="p-4 border-t border-dark-700/50 mt-auto">
                <Card className="!p-3 !bg-dark-900">
                    <h4 className="text-sm font-bold text-white mb-2">Управление Проектом</h4>
                    <div className="text-xs text-gray-400 mb-3">
                        <p>Стадия: <span className={`font-semibold ${fundingStage === 1 ? 'text-gray-300' : fundingStage === 2 ? 'text-cyan-400' : 'text-yellow-400'}`}>
                            {fundingStage === 1 ? 'Pre-seed' : fundingStage === 2 ? 'Раунд А' : 'Раунд B'}
                        </span></p>
                    </div>
                    <div className="space-y-2">
                        <Button onClick={() => handleUpgrade(2)} disabled={fundingStage >= 2 || filledSlots < 3} variant="secondary" className="w-full !text-xs !py-1.5">
                            <TrendingUp className="w-4 h-4 mr-1.5"/>Перейти к Раунду А
                        </Button>
                        <Button onClick={() => handleUpgrade(3)} disabled={fundingStage >= 3 || filledSlots < 6} variant="secondary" className="w-full !text-xs !py-1.5">
                            <PieChart className="w-4 h-4 mr-1.5"/>Перейти к Раунду B
                        </Button>
                         <p className="text-[10px] text-gray-500 text-center pt-1">
                            {fundingStage === 1 && filledSlots < 3 ? `Нужно ${3 - filledSlots} партнера для Раунда А` : ''}
                            {fundingStage === 2 && filledSlots < 6 ? `Нужно ${6 - filledSlots} партнера для Раунда B` : ''}
                        </p>
                    </div>
                </Card>
            </div>
        </>
    );

    if (portfolio.length === 0) {
        return (
            <Card className="animate-slide-in-up flex flex-col items-center justify-center text-center p-8 h-full">
                <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mb-6 border-4 border-dark-600">
                    <Rocket className="w-12 h-12 text-brand-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white">Ваш первый шаг в большую игру</h2>
                <p className="text-gray-400 mt-2 max-w-md">
                    Запустите свой первый Проект "Pre-seed", чтобы начать строить свою бизнес-империю. Это откроет вам доступ к рынку.
                </p>
                <Button onClick={activateFirstProject} className="mt-8 !py-4 !px-8 !text-lg animate-glow">
                    Запустить Проект "Pre-seed"
                </Button>
            </Card>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-full w-full gap-4">
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                 <Card className="animate-slide-in-up flex flex-col h-full !p-0 overflow-hidden">
                    <div className="p-4 border-b border-dark-700/50 flex justify-between items-center">
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
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={handleExport} className="!px-3 !py-1.5"><Download className="h-4 w-4"/></Button>
                            <Button variant="secondary" onClick={() => setAnalyticsPanelOpen(true)} className="!px-3 !py-1.5"><BarChart3 className="h-4 w-4"/></Button>
                            <button onClick={() => setToolsPanelOpen(true)} className="p-2 rounded-md hover:bg-dark-700 lg:hidden"><UsersIcon className="h-5 w-5"/></button>
                        </div>
                    </div>

                    {simulationResult && (
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/50 m-4 text-center animate-fade-in">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-yellow-300 text-sm">РЕЖИМ СИМУЛЯЦИИ</h4>
                                <button onClick={handleExitSimulation} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"><XCircle className="h-4 w-4"/>Выйти</button>
                            </div>
                            <ul className="text-xs text-yellow-200 mt-2 list-disc list-inside text-left">
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
                        <div 
                            ref={matrixContentRef} 
                            className="p-12 transition-transform duration-200 ease-out"
                            style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
                        >
                            <MemoizedProjectNode
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
                </Card>
            </main>

            {/* Desktop Sidebar */}
            <aside className="w-full lg:w-96 flex-shrink-0 hidden lg:flex flex-col">
                 <Card className="h-full flex flex-col">
                    <ToolsPanelContent />
                 </Card>
            </aside>
            
            {/* Mobile FAB and Drawer */}
            <div className="lg:hidden">
                <div 
                    className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${isToolsPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setToolsPanelOpen(false)}
                />
                 <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-dark-800 z-40 shadow-2xl transform transition-transform ${isToolsPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b border-dark-700">
                        <h3 className="font-bold text-white">Инструменты</h3>
                        <button onClick={() => setToolsPanelOpen(false)}><X className="h-5 w-5 text-gray-400"/></button>
                    </div>
                    <div className="h-[calc(100%-65px)] overflow-y-auto flex flex-col">
                        <ToolsPanelContent />
                    </div>
                 </div>
            </div>

            <AnalyticsPanel node={currentNode} isOpen={isAnalyticsPanelOpen} onClose={() => setAnalyticsPanelOpen(false)} />
            <SimulationModal isOpen={!!simulatingSlot} onClose={() => setSimulatingSlot(null)} onSelect={handleSelectPlacement} />
        </div>
    );
};


export default ProjectView;
