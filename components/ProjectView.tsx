
import React, { useState, useMemo } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { MOCK_PROJECTS } from '../constants.ts';
import { Briefcase, Check, Copy, DollarSign, Link, Rocket, Target, TrendingUp, Users } from 'lucide-react';
import type { Project } from '../types.ts';

const ProjectCard: React.FC<{ project: Project, onActivate: (id: string) => void }> = ({ project, onActivate }) => {
    const { user } = useAppContext();
    const progress = (project.sharesSold / project.totalShares) * 100;
    const isLocked = user.fundingCompleted < 1 && project.type !== 'Pre-seed';

    const nextMilestone = project.milestones.find(m => m.shares > project.sharesSold);
    
    return (
        <Card className={`transition-all duration-300 ${isLocked ? 'opacity-50 saturate-50' : ''} ${project.isActive ? 'border-brand-primary/50 animate-card-glow' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-white">{project.type}</h3>
                    <p className="text-sm text-gray-400">Стоимость запуска: ${project.entryCost} CAP</p>
                </div>
                {project.isActive ? (
                     <span className="px-3 py-1 text-xs font-bold text-green-300 bg-green-500/20 rounded-full">Активен</span>
                ) : (
                    <span className="px-3 py-1 text-xs font-bold text-gray-400 bg-dark-700 rounded-full">Неактивен</span>
                )}
            </div>

            <div className="my-6">
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-300">Финансирование</p>
                    <p className="text-sm font-bold text-brand-accent">{project.sharesSold} / {project.totalShares} Долей</p>
                </div>
                <div className="w-full bg-dark-900 rounded-full h-4 relative overflow-hidden border border-dark-700">
                    <div className="bg-gradient-to-r from-brand-secondary to-brand-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    {project.milestones.map(m => (
                         <div key={m.shares} className="absolute top-0 h-full w-0.5 bg-dark-600" style={{left: `${(m.shares/project.totalShares)*100}%`}}></div>
                    ))}
                </div>
                 {nextMilestone && project.isActive && (
                    <p className="text-xs text-center text-gray-400 mt-2">
                        <span className="font-semibold text-brand-accent">Следующая веха:</span> {nextMilestone.shares} Долей
                     </p>
                 )}
            </div>

             <div className="text-center">
                 <Button onClick={() => onActivate(project.id)} disabled={project.isActive || isLocked}>
                    {isLocked ? 'Недоступно' : project.isActive ? 'Проект активен' : 'Активировать'}
                </Button>
             </div>
        </Card>
    )
};


const ProjectView: React.FC = () => {
    const { user, addToast } = useAppContext();
    const [projects, setProjects] = useState(MOCK_PROJECTS);

    const activeProject = useMemo(() => projects.find(p => p.isActive), [projects]);

    const handleActivateProject = (projectId: string) => {
        setProjects(prev => prev.map(p => ({
            ...p,
            isActive: p.id === projectId,
        })));
        const activated = projects.find(p => p.id === projectId);
        addToast(`Проект "${activated?.type}" успешно активирован!`, 'success');
    };
    
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(user.referralLink);
        setCopied(true);
        addToast('Ссылка для продажи Доли скопирована!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    if (!activeProject) {
        return (
            <div className="animate-slide-in-up space-y-6">
                <Card className="text-center">
                    <Rocket className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white">Нет активных Проектов</h2>
                    <p className="text-gray-400 max-w-md mx-auto mt-2">Выберите и активируйте один из доступных Проектов, чтобы начать привлекать финансирование.</p>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => <ProjectCard key={p.id} project={p} onActivate={handleActivateProject} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2">
                <ProjectCard project={activeProject} onActivate={handleActivateProject} />
            </div>
             <div className="space-y-6">
                <Card>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5"/> Ваша главная задача</h3>
                    <p className="text-sm text-gray-300 mb-4">Для получения финансирования вам необходимо продавать Доли в вашем активном Проекте. Поделитесь ссылкой с потенциальными партнерами.</p>
                    <Button onClick={handleCopy} className="w-full">
                        {copied ? <Check className="h-5 w-5 mr-2" /> : <Link className="h-5 w-5 mr-2" />}
                        {copied ? 'Ссылка скопирована!' : 'Продать Долю (копировать ссылку)'}
                    </Button>
                </Card>
                 <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Финансовый Прогноз (AI)</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Прибыль с Доли:</span><span className="font-bold text-white">$50 CAP</span></div>
                        <div className="flex justify-between"><span>Бонус за веху (3):</span><span className="font-bold text-white">$150 CAP</span></div>
                        <div className="flex justify-between"><span>Полное Финансирование:</span><span className="font-bold text-accent-green">$1,200 CAP</span></div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProjectView;
