
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Card from './ui/Card.tsx';
import { MOCK_MATRIX_DATA } from '../constants.ts';
import type { MatrixNode as MatrixNodeType } from '../types.ts';
import * as htmlToImage from 'html-to-image';
import { User, ShieldPlus, Link, Check, ChevronRight, Search, Maximize, Minimize, AlertCircle, Award, Users as UsersIcon, Network, Layers, Flame, Snowflake, ArrowDownFromLine, Copy as CopyIcon, Filter, Download, X, Home, BarChart3 } from 'lucide-react';
import AnalyticsPanel from './AnalyticsPanel.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

interface MatrixNodeProps {
    node: MatrixNodeType;
    depth: number;
    isRoot: boolean;
    referralLink: string;
    onNodeClick: (node: MatrixNodeType) => void;
    highlightedLevel: number | null;
    highlightedPath: string[];
    activeFilter: string | null;
    hoveredNodeId: string | null;
    onNodeHover: (nodeId: string | null) => void;
    parentNodeId: string | null;
}

const MemoizedMatrixNode: React.FC<MatrixNodeProps> = React.memo(({ node, depth, isRoot, referralLink, onNodeClick, highlightedLevel, highlightedPath, activeFilter, hoveredNodeId, onNodeHover, parentNodeId }) => {
    const [copied, setCopied] = useState(false);
    
    const nodeSize = isRoot ? 'w-28 h-28' : 'w-24 h-24';
    const avatarSize = isRoot ? 'w-16 h-16' : 'w-14 h-14';
    const isNavigable = node.isFilled && !isRoot;

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (isNavigable) {
            onNodeClick(node);
        } else if (!node.isFilled) {
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [isNavigable, node, onNodeClick, referralLink]);
    
    const isLevelHighlighted = highlightedLevel !== null && highlightedLevel === depth;
    const isPathHighlighted = highlightedPath.includes(node.id);
    const isFilterHighlighted = activeFilter !== null && node.isFilled && (node.performance === activeFilter || node.nodeType === activeFilter);
    const isHovered = hoveredNodeId === node.id || hoveredNodeId === parentNodeId || (node.children?.some(c => c.id === hoveredNodeId) ?? false);


    const typeColorClasses: Record<string, string> = {
        self: 'border-purple-500',
        spillover: 'border-cyan-400',
        clone: 'border-orange-400',
    };
    
    const nodeBorderColor = node.isFilled
        ? isRoot ? 'border-brand-primary' : typeColorClasses[node.nodeType || ''] || 'border-dark-600'
        : 'border-dark-600 border-dashed';

    const typeLabels: Record<string, string> = { 'spillover': 'Перелив', 'clone': 'Клон', 'self': 'Личник' };
    const performanceLabels: Record<string, string> = { 'hot': '"Горячий"', 'stagnant': 'Неактивный' };

    const filledTooltipContent = (
        <div className="text-left text-xs space-y-1.5 p-1">
            <p className="font-bold text-sm text-white">{node.name}</p>
            {node.nodeType && <p className="text-gray-300">Тип: <span className="font-semibold text-white">{typeLabels[node.nodeType]}</span></p>}
            {node.performance && <p className="text-gray-300">Статус: <span className="font-semibold text-white">{performanceLabels[node.performance]}</span></p>}
            <p className="text-gray-400">Присоединился: {node.joinDate}</p>
            <div className="flex items-center gap-4 pt-1 border-t border-dark-600">
                {node.level !== undefined && <p className="text-gray-300 flex items-center gap-1.5"><Award className="h-3 w-3" /> Ур: {node.level}</p>}
                {node.referrals !== undefined && <p className="text-gray-300 flex items-center gap-1.5"><UsersIcon className="h-3 w-3" /> Реф: {node.referrals}</p>}
                {node.downline !== undefined && <p className="text-gray-300 flex items-center gap-1.5"><Network className="h-3 w-3" /> Структура: {node.downline}</p>}
            </div>
            {isNavigable && <p className="text-brand-accent mt-2 font-semibold text-center">Кликните, чтобы перейти</p>}
        </div>
    );

    const emptyTooltipContent = copied ? 
        <span className="flex items-center gap-1.5 text-green-400"><Check className="h-4 w-4" /> Скопировано!</span> :
        <span className="flex items-center gap-1.5"><Link className="h-4 w-4" /> Пригласить</span>;
    
    return (
        <div 
            className="flex flex-col items-center relative" 
            onMouseEnter={() => node.isFilled && onNodeHover(node.id)}
            onMouseLeave={() => node.isFilled && onNodeHover(null)}
        >
            <div
                className={`
                    group flex flex-col items-center justify-center p-1 rounded-full border-4 transition-all duration-300 relative transform hover:scale-110 hover:shadow-2xl
                    ${node.isFilled ? 'bg-dark-700' : 'bg-dark-800'}
                    ${nodeBorderColor}
                    ${isNavigable ? 'cursor-pointer hover:shadow-brand-primary/50' : !node.isFilled ? 'cursor-copy' : ''}
                    ${isLevelHighlighted && '!border-brand-accent shadow-brand-accent/40'}
                    ${isPathHighlighted && 'ring-2 ring-offset-2 ring-offset-dark-800 ring-yellow-400 animate-pulse'}
                    ${isFilterHighlighted && 'ring-2 ring-offset-2 ring-offset-dark-800 ring-cyan-400'}
                    ${isHovered && !isPathHighlighted ? 'scale-110 shadow-lg shadow-brand-accent/50' : ''}
                    ${nodeSize}
                `}
                aria-label={node.isFilled ? node.name : 'Пригласить участника'}
            >
             <button
                onClick={handleClick}
                className="w-full h-full flex flex-col items-center justify-center"
             >
                {node.isFilled ? (
                    <>
                        <img src={node.avatarUrl} alt={node.name} className={`rounded-full object-cover ${avatarSize}`} />
                         <p className={`mt-1 text-center font-semibold truncate w-full text-xs ${isRoot ? 'text-sm' : 'text-xs'} text-white`}>
                            {node.name}
                        </p>
                        {node.performance === 'hot' && <span className="absolute top-0 right-0" title="Горячий партнер"><Flame className="h-6 w-6 text-red-500 bg-dark-700 rounded-full p-1" /></span>}
                        {node.performance === 'stagnant' && <span className="absolute top-0 right-0" title="Неактивный партнер"><Snowflake className="h-6 w-6 text-blue-300 bg-dark-700 rounded-full p-1" /></span>}
                        {node.nodeType === 'spillover' && <span className="absolute top-0 left-0" title="Перелив"><ArrowDownFromLine className="h-6 w-6 text-cyan-400 bg-dark-700 rounded-full p-1" /></span>}
                        {node.nodeType === 'clone' && <span className="absolute top-0 left-0" title="Клон"><CopyIcon className="h-6 w-6 text-purple-400 bg-dark-700 rounded-full p-1" /></span>}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                       <ShieldPlus className="w-8 h-8 text-gray-500" />
                       <p className="mt-1 text-xs text-gray-500">Свободно</p>
                    </div>
                )}
             </button>
               <div className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-2 bg-dark-900 border border-dark-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                    {node.isFilled ? filledTooltipContent : emptyTooltipContent}
                </div>
            </div>

            {node.children && node.children.length > 0 && (
                <>
                    <div className="absolute top-full w-full h-10 pointer-events-none">
                       <svg width="100%" height="100%" viewBox="0 0 256 40" preserveAspectRatio="none" className="overflow-visible">
                          <defs>
                            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#6d28d9" />
                            </linearGradient>
                          </defs>
                          {node.children.map((child, index) => {
                            const isChildHovered = hoveredNodeId === child.id || hoveredNodeId === node.id;
                            const pathD = index === 0 
                                ? "M 128 0 C 128 20, 56 20, 56 40" 
                                : "M 128 0 C 128 20, 200 20, 200 40";
                            return (
                                <path 
                                    key={child.id}
                                    d={pathD}
                                    stroke="url(#line-gradient)" 
                                    strokeWidth={isChildHovered ? 4 : 2}
                                    fill="none" 
                                    strokeLinecap="round"
                                    strokeDasharray="10 10"
                                    className={`transition-all duration-300 ${isChildHovered ? 'opacity-100' : 'opacity-40'} animate-flow-line`}
                                />
                            )
                          })}
                       </svg>
                    </div>
                    <div className="mt-10 flex justify-center relative gap-16 md:gap-24">
                        {node.children.map((child) => (
                           <MemoizedMatrixNode {...{key: child.id, node: child, depth: depth + 1, isRoot: false, referralLink, onNodeClick, highlightedLevel, highlightedPath, activeFilter, hoveredNodeId, onNodeHover, parentNodeId: node.id}} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});

const MatrixView: React.FC = () => {
    const { user } = useAppContext();
    const [history, setHistory] = useState<MatrixNodeType[]>([MOCK_MATRIX_DATA]);
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [highlightedLevel, setHighlightedLevel] = useState<number | null>(null);
    const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [isAnalyticsPanelOpen, setAnalyticsPanelOpen] = useState(false);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    const matrixViewportRef = useRef<HTMLDivElement>(null);
    const matrixContentRef = useRef<HTMLDivElement>(null);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const currentNode = history[history.length - 1];
    
    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleNodeClick = useCallback((node: MatrixNodeType) => {
        if (node.isFilled) {
            setHistory(prev => [...prev, node]);
            setTransform({ x: 0, y: 0, scale: 1 }); // Reset view on navigation
        }
    }, []);

    const handleBreadcrumbClick = useCallback((index: number) => {
        setHistory(prev => prev.slice(0, index + 1));
        setTransform({ x: 0, y: 0, scale: 1 });
    }, []);
    
    const handleToggleFullscreen = () => {
        const el = matrixViewportRef.current?.parentElement;
        if (!el) return;
        !isFullscreen ? el.requestFullscreen() : document.exitFullscreen();
    };

    const handleExport = useCallback(() => {
        if (matrixContentRef.current === null) return;
        htmlToImage.toPng(matrixContentRef.current, { cacheBust: true, backgroundColor: '#0f172a' })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `matrix-flow-${currentNode.id}-${new Date().toISOString().split('T')[0]}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => console.error('Не удалось экспортировать матрицу!', err));
    }, [currentNode]);
    
    const findNodePath = (root: MatrixNodeType, query: string): MatrixNodeType[] | null => {
        const lowerCaseQuery = query.toLowerCase();
        const search = (node: MatrixNodeType, path: MatrixNodeType[]): MatrixNodeType[] | null => {
            if (!node.isFilled) return null;
            const currentPath = [...path, node];
            if (node.id.toLowerCase().includes(lowerCaseQuery) || node.name.toLowerCase().includes(lowerCaseQuery)) return currentPath;
            if (node.children) {
                for (const child of node.children) {
                    const result = search(child, currentPath);
                    if (result) return result;
                }
            }
            return null;
        };
        return search(root, []);
    };
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchError(null);
        setActiveFilter(null);
        if (!searchQuery.trim()) return;

        const path = findNodePath(MOCK_MATRIX_DATA, searchQuery);
        if (path) {
            setHistory(path);
            setHighlightedPath(path.map(p => p.id));
            setTimeout(() => setHighlightedPath([]), 4000);
        } else {
            setSearchError(`Участник с именем или ID "${searchQuery}" не найден.`);
            setTimeout(() => setSearchError(null), 5000);
        }
    };
    
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
        matrixViewportRef.current!.style.cursor = 'grabbing';
    }, []);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
        matrixViewportRef.current!.style.cursor = 'grab';
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }, [isDragging]);

    const onWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const rect = matrixViewportRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const scaleAmount = 1 - e.deltaY * 0.001;
        const newScale = Math.max(0.2, Math.min(2, transform.scale * scaleAmount));
        
        setTransform(prev => ({
            scale: newScale,
            x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
            y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
        }));
    }, [transform.scale]);

    const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

    const maxDepth = 4;
    const filterOptions = [
        { key: 'spillover', label: 'Переливы', icon: <ArrowDownFromLine className="h-4 w-4" /> },
        { key: 'clone', label: 'Клоны', icon: <CopyIcon className="h-4 w-4" /> },
        { key: 'hot', label: 'Горячие', icon: <Flame className="h-4 w-4" /> },
        { key: 'stagnant', label: 'Неактивные', icon: <Snowflake className="h-4 w-4" /> },
    ];

    return (
        <Card className="animate-slide-in-up flex flex-col h-full !p-0 md:!p-4 overflow-hidden">
            <div className="flex-shrink-0 p-4 md:p-2">
                <h2 className="text-2xl font-bold text-white mb-2">Командный центр Матрицы</h2>
                <p className="text-gray-400 mb-4">Исследуйте свою структуру с помощью мощных инструментов.</p>
                
                <div className="overflow-x-auto whitespace-nowrap mb-4 pb-2 bg-dark-800 p-2 rounded-lg border border-dark-700">
                    <div className="flex items-center gap-1.5 text-sm">
                        {history.map((node, index) => (
                            <React.Fragment key={node.id}>
                                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-600 flex-shrink-0" />}
                                <button onClick={() => handleBreadcrumbClick(index)} disabled={index === history.length - 1} className={`font-medium rounded-md px-2.5 py-1.5 transition-colors truncate ${index === history.length - 1 ? 'text-white bg-brand-primary/50 cursor-default' : 'text-gray-300 hover:text-white hover:bg-dark-700'}`}>
                                    {index === 0 ? 'Вы' : node.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                 <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <form onSubmit={handleSearch} className="w-full md:w-auto flex-grow flex items-center gap-2">
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск по имени или ID..." className="w-full bg-dark-900 border border-dark-600 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"/>
                        <button type="submit" className="p-2.5 bg-brand-primary hover:bg-brand-secondary rounded-md transition-colors"><Search className="h-4 w-4 text-white"/></button>
                    </form>
                     <div className="flex items-center justify-start md:justify-end gap-2 flex-wrap">
                        <button onClick={resetView} title="Домой" className="p-2 bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"><Home className="h-4 w-4"/></button>
                        <button onClick={handleExport} title="Экспорт в PNG" className="p-2 bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"><Download className="h-4 w-4"/></button>
                        <button onClick={() => setAnalyticsPanelOpen(true)} title="Аналитика" className="p-2 bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"><BarChart3 className="h-4 w-4"/></button>
                        <button onClick={handleToggleFullscreen} title="Полноэкранный режим" className="p-2 bg-dark-700 hover:bg-dark-600 rounded-md transition-colors">
                            {isFullscreen ? <Minimize className="h-4 w-4"/> : <Maximize className="h-4 w-4"/>}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-dark-800 rounded-lg border border-dark-700 overflow-x-auto">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-300 flex-shrink-0"><Layers className="h-4 w-4"/><span>Уровни:</span></div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setHighlightedLevel(null)} className={`px-2 py-0.5 text-xs rounded-md ${highlightedLevel === null ? 'bg-brand-primary text-white' : 'bg-dark-700 hover:bg-dark-600'}`}>Все</button>
                        {Array.from({ length: maxDepth }, (_, i) => i + 1).map(level => (
                           <button key={level} onClick={() => setHighlightedLevel(level)} className={`px-2.5 py-0.5 text-xs rounded-md ${highlightedLevel === level ? 'bg-brand-primary text-white' : 'bg-dark-700 hover:bg-dark-600'}`}>{level}</button>
                        ))}
                    </div>
                     <div className="flex items-center gap-2 text-sm font-medium text-gray-300 sm:ml-4 flex-shrink-0"><Filter className="h-4 w-4"/><span>Фильтры:</span></div>
                     <div className="flex items-center gap-1 flex-wrap">
                        {filterOptions.map(opt => (
                            <button key={opt.key} onClick={() => setActiveFilter(opt.key)} className={`flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-md ${activeFilter === opt.key ? 'bg-cyan-500 text-white' : 'bg-dark-700 hover:bg-dark-600'}`}>{opt.icon}{opt.label}</button>
                        ))}
                        {activeFilter && <button onClick={() => setActiveFilter(null)} className="p-1 bg-red-500/50 hover:bg-red-500/80 rounded-full"><X className="h-3 w-3"/></button>}
                     </div>
                </div>

                {searchError && <div className="flex items-center gap-3 bg-red-500/10 text-red-400 p-3 rounded-lg my-4 animate-fade-in text-sm"><AlertCircle className="h-5 w-5" /><p>{searchError}</p></div>}
            </div>
            
            <div 
                ref={matrixViewportRef}
                className="relative flex-1 bg-dark-900 rounded-lg mt-4 border border-dark-700 min-h-[450px] flex items-center justify-center overflow-hidden transition-all animate-gradient-bg cursor-grab"
                style={{backgroundImage: 'radial-gradient(circle at center, #1e293b 0, #0f172a 100%)'}}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseUp}
                onWheel={onWheel}
            >
                <div ref={matrixContentRef} className="p-8" style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transition: isDragging ? 'none' : 'transform 0.1s linear' }}>
                    <MemoizedMatrixNode 
                        node={currentNode} 
                        depth={0} 
                        isRoot={true} 
                        referralLink={user.referralLink} 
                        onNodeClick={handleNodeClick} 
                        {...{highlightedLevel, highlightedPath, activeFilter, hoveredNodeId}} 
                        onNodeHover={setHoveredNodeId}
                        parentNodeId={null}
                    />
                </div>
            </div>
            <AnalyticsPanel node={currentNode} isOpen={isAnalyticsPanelOpen} onClose={() => setAnalyticsPanelOpen(false)} />
        </Card>
    );
};

export default MatrixView;
