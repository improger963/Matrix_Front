
import React, { useState, useMemo } from 'react';
import Card from './ui/Card.tsx';
import type { GuildMember } from '../types.ts';
import { MOCK_GUILD_MEMBERS } from '../constants.ts';
import { MoreVertical, Search as SearchIcon, ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = 'name' | 'joinDate' | 'level' | 'investors';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';

const MemberCard: React.FC<{ member: GuildMember }> = ({ member }) => {
    return (
        <Card className="!p-3 !bg-dark-800/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={member.avatarUrl} alt={member.name} className="h-12 w-12 rounded-full" />
                    <div>
                        <p className="font-bold text-white">{member.name}</p>
                        <p className="text-xs text-gray-400">Присоед.: {new Date(member.joinDate).toLocaleDateString('ru-RU')}</p>
                    </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-white"><MoreVertical className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-dark-700 p-2 rounded-lg"><p className="text-xs text-gray-400">Уровень</p><p className="font-bold text-white">{member.level}</p></div>
                <div className="bg-dark-700 p-2 rounded-lg"><p className="text-xs text-gray-400">Инвесторы</p><p className="font-bold text-white">{member.investors}</p></div>
                 <div className="bg-dark-700 p-2 rounded-lg flex flex-col justify-center items-center">
                    <p className="text-xs text-gray-400">Статус</p>
                    <span className={`px-2 py-0.5 mt-1 text-xs font-semibold rounded-full ${member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {member.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                 </div>
            </div>
        </Card>
    )
};

const TeamListView: React.FC = () => {
    const [sortKey, setSortKey] = useState<SortKey>('joinDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const filteredAndSortedTeamMembers = useMemo(() => {
         const filtered = MOCK_GUILD_MEMBERS
            .filter(member => statusFilter === 'all' || member.status === statusFilter)
            .filter(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return filtered.sort((a, b) => {
            let comparison = 0;
            if (sortKey === 'name') comparison = a.name.localeCompare(b.name);
            else if (sortKey === 'joinDate') comparison = new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
            else comparison = (b[sortKey] as number) - (a[sortKey] as number);
            return sortOrder === 'asc' ? -comparison : comparison;
        });
    }, [sortKey, sortOrder, searchQuery, statusFilter]);
    
    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortOrder('desc'); }
    };

    const SortableHeader: React.FC<{ sortKeyName: SortKey, children: React.ReactNode, className?: string }> = ({ sortKeyName, children, className }) => (
        <th className={`p-4 text-sm font-semibold text-gray-400 cursor-pointer ${className}`} onClick={() => handleSort(sortKeyName)}>
            <div className="flex items-center gap-1">
                {children}
                {sortKey === sortKeyName && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
            </div>
        </th>
    );

    return (
        <Card>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Мои личные партнеры</h3>
                    <p className="text-sm text-gray-400">{filteredAndSortedTeamMembers.length} партнеров найдено</p>
                </div>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск..." className="w-full bg-dark-900 border border-dark-600 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"/>
                    </div>
                    <div className="flex items-center gap-1 bg-dark-800 p-1 rounded-lg">
                        {(['all', 'active', 'inactive'] as StatusFilter[]).map(status => (
                            <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${statusFilter === status ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-dark-700'}`}>
                                {status === 'all' ? 'Все' : status === 'active' ? 'Активные' : 'Неактивные'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="md:hidden space-y-3">
                {filteredAndSortedTeamMembers.map(member => <MemberCard key={member.id} member={member} />)}
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-dark-700">
                        <tr>
                            <SortableHeader sortKeyName="name">Партнер</SortableHeader>
                            <SortableHeader sortKeyName="joinDate">Дата вступления</SortableHeader>
                            <SortableHeader sortKeyName="level" className="text-center">Уровень</SortableHeader>
                            <SortableHeader sortKeyName="investors" className="text-center">Их инвесторы</SortableHeader>
                            <th className="p-4 text-sm font-semibold text-gray-400">Статус</th>
                            <th className="p-4 text-sm font-semibold text-gray-400 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedTeamMembers.map(member => (
                            <tr key={member.id} className="border-b border-dark-700 last:border-b-0 hover:bg-dark-700/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                                        <span className="font-medium text-white">{member.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-400">{new Date(member.joinDate).toLocaleDateString('ru-RU')}</td>
                                <td className="p-4 font-medium text-white text-center">{member.level}</td>
                                <td className="p-4 font-medium text-white text-center">{member.investors}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 w-fit ${member.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                        <span className={`h-2 w-2 rounded-full ${member.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                                        {member.status === 'active' ? 'Активен' : 'Неактивен'}
                                    </span>
                                </td>
                                 <td className="p-4 text-right">
                                    <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-700"><MoreVertical className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default TeamListView;
