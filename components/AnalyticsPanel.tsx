import React, { useMemo, useEffect } from 'react';
import type { MatrixNode } from '../types';
import { X, BarChart3, Users, GitBranch, PieChart, Zap, HelpCircle } from 'lucide-react';

interface AnalyticsPanelProps {
    node: MatrixNode;
    isOpen: boolean;
    onClose: () => void;
}

interface NodeStats {
    totalSlots: number;
    filledSlots: number;
    leftLegCount: number;
    rightLegCount: number;
    composition: {
        self: number;
        spillover: number;
        clone: number;
    };
    performance: {
        hot: number;
        stagnant: number;
        normal: number;
    };
}

const getDepth = (node: MatrixNode | undefined): number => {
    if (!node || !node.children || node.children.length === 0) {
        return 0;
    }
    return 1 + Math.max(...node.children.map(getDepth));
}

const calculateStats = (node: MatrixNode): NodeStats => {
    const stats: NodeStats = {
        totalSlots: 0,
        filledSlots: 0,
        leftLegCount: 0,
        rightLegCount: 0,
        composition: { self: 0, spillover: 0, clone: 0 },
        performance: { hot: 0, stagnant: 0, normal: 0 }
    };

    const countFilledNodes = (n: MatrixNode | undefined): number => {
        if (!n || !n.isFilled) return 0;
        let count = 1;
        if (n.children) {
            count += countFilledNodes(n.children[0]);
            count += countFilledNodes(n.children[1]);
        }
        return count;
    }
    
    stats.leftLegCount = countFilledNodes(node.children?.[0]);
    stats.rightLegCount = countFilledNodes(node.children?.[1]);
    
    const collectStats = (n: MatrixNode | undefined) => {
        if (!n || !n.isFilled) return;

        if (n.nodeType && stats.composition.hasOwnProperty(n.nodeType)) {
            stats.composition[n.nodeType]++;
        }
        if (n.performance && stats.performance.hasOwnProperty(n.performance)) {
            stats.performance[n.performance]++;
        } else {
            stats.performance.normal++;
        }

        if (n.children) {
            collectStats(n.children[0]);
            collectStats(n.children[1]);
        }
    }
    
    collectStats(node);

    if (node.isFilled && !node.performance) {
         stats.performance.normal--;
    }

    stats.filledSlots = stats.leftLegCount + stats.rightLegCount + (node.isFilled ? 1 : 0);
    stats.totalSlots = Math.pow(2, getDepth(node) + 1) - 1;

    return stats;
};

const StatCard: React.FC<{ title: string; value: string; description: string; children?: React.ReactNode }> = ({ title, value, description, children }) => (
    <div className="bg-dark-900/50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-400">{title}</h4>
            <span title={description}>
                <HelpCircle className="w-4 h-4 text-gray-500" />
            </span>
        </div>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {children}
    </div>
);


const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ node, isOpen, onClose }) => {
    const stats = useMemo(() => calculateStats(node), [node]);

     useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }
    
    const fillPercentage = stats.totalSlots > 0 ? ((stats.filledSlots / stats.totalSlots) * 100).toFixed(1) : "0";
    const totalLegs = stats.leftLegCount + stats.rightLegCount;
    const leftLegPercentage = totalLegs > 0 ? (stats.leftLegCount / totalLegs) * 100 : 50;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-modal-title"
        >
            <div 
                className="bg-dark-800 border border-dark-700 rounded-xl shadow-lg w-full max-w-2xl animate-slide-in-up p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between pb-4 border-b border-dark-700">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-brand-primary" />
                        <h3 id="analytics-modal-title" className="text-xl font-bold text-white">Структурная Аналитика</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-dark-700">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                
                <div className="pt-6 max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                     <p className="text-center text-sm text-gray-300">
                        Анализ ветки для: <span className="font-bold text-brand-accent">{node.name}</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatCard title="Заполнение структуры" value={`${fillPercentage}%`} description="Процент заполненных мест в видимой структуре.">
                             <div className="w-full bg-dark-700 rounded-full h-2.5 mt-2">
                                 <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${fillPercentage}%` }}></div>
                             </div>
                             <p className="text-xs text-right text-gray-400 mt-1">{stats.filledSlots} / {stats.totalSlots} мест</p>
                        </StatCard>

                        <StatCard title="Баланс ветвей" value={`${stats.leftLegCount} / ${stats.rightLegCount}`} description="Соотношение партнеров в левой и правой ветви. Идеальный баланс способствует стабильному росту.">
                            <div className="flex w-full h-2.5 rounded-full overflow-hidden mt-2 bg-dark-700">
                                <div className="bg-cyan-500 transition-all duration-500" style={{ width: `${leftLegPercentage}%` }} title={`Левая ветвь: ${stats.leftLegCount}`}></div>
                                <div className="bg-purple-500 transition-all duration-500" style={{ width: `${100-leftLegPercentage}%` }} title={`Правая ветвь: ${stats.rightLegCount}`}></div>
                            </div>
                        </StatCard>
                        
                        <div className="bg-dark-900/50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2"><PieChart className="w-4 h-4" />Состав структуры</h4>
                            <div className="space-y-2 text-xs">
                               <div className="flex justify-between"><span><Users className="w-3 h-3 inline mr-1.5" />Лично приглашенные:</span> <span className="font-bold text-white">{stats.composition.self}</span></div>
                               <div className="flex justify-between"><span><GitBranch className="w-3 h-3 inline mr-1.5 text-cyan-400" />Переливы:</span> <span className="font-bold text-white">{stats.composition.spillover}</span></div>
                               <div className="flex justify-between"><span><Users className="w-3 h-3 inline mr-1.5 text-purple-400" />Клоны:</span> <span className="font-bold text-white">{stats.composition.clone}</span></div>
                            </div>
                        </div>
                         <div className="bg-dark-900/50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2"><Zap className="w-4 h-4" />Эффективность</h4>
                            <div className="space-y-2 text-xs">
                               <div className="flex justify-between"><span><span className="text-red-500">●</span> "Горячие":</span> <span className="font-bold text-white">{stats.performance.hot}</span></div>
                               <div className="flex justify-between"><span><span className="text-blue-400">●</span> "Неактивные":</span> <span className="font-bold text-white">{stats.performance.stagnant}</span></div>
                               <div className="flex justify-between"><span><span className="text-gray-500">●</span> Стабильные:</span> <span className="font-bold text-white">{stats.performance.normal}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
