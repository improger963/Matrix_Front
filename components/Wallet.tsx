import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { MOCK_TRANSACTIONS } from '../constants';
import type { Transaction, User } from '../types';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, History, CreditCard, Bitcoin, Wallet as WalletIcon, CheckCircle } from 'lucide-react';

type Tab = 'deposit' | 'withdraw' | 'history';

const getTransactionRow = (transaction: Transaction) => {
    const typeMap = {
        deposit: { text: 'Пополнение', icon: <ArrowUpCircle className="h-5 w-5 text-green-500" /> },
        withdrawal: { text: 'Вывод', icon: <ArrowDownCircle className="h-5 w-5 text-red-500" /> },
        earning: { text: 'Начисление', icon: <DollarSign className="h-5 w-5 text-yellow-500" /> },
        activation: { text: 'Активация', icon: <WalletIcon className="h-5 w-5 text-blue-500" /> },
    };

    const statusMap = {
        completed: { text: 'Выполнено', className: 'bg-green-500/20 text-green-400' },
        pending: { text: 'В обработке', className: 'bg-yellow-500/20 text-yellow-400' },
        failed: { text: 'Отклонено', className: 'bg-red-500/20 text-red-400' },
    };
    
    const amountClass = transaction.amount > 0 ? 'text-green-400' : 'text-red-400';
    const sign = transaction.amount > 0 ? '+' : '';

    return (
        <tr key={transaction.id} className="border-b border-dark-700 last:border-b-0 hover:bg-dark-700/50">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    {typeMap[transaction.type].icon}
                    <span className="font-medium text-white">{typeMap[transaction.type].text}</span>
                </div>
            </td>
            <td className={`p-4 font-mono font-semibold ${amountClass}`}>{sign}${Math.abs(transaction.amount).toFixed(2)}</td>
            <td className="p-4 text-gray-400 hidden sm:table-cell">{transaction.date}</td>
            <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[transaction.status].className}`}>
                    {statusMap[transaction.status].text}
                </span>
            </td>
        </tr>
    );
};

interface WalletProps {
    user: User;
}

const Wallet: React.FC<WalletProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<Tab>('deposit');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!amount || Number(amount) <= 0) {
            setMessage('Пожалуйста, введите корректную сумму.');
            return;
        }
        
        if (activeTab === 'withdraw' && !address) {
            setMessage('Пожалуйста, введите адрес для вывода.');
            return;
        }

        console.log({
            type: activeTab,
            amount,
            ...(activeTab === 'withdraw' && { address }),
            ...(activeTab === 'deposit' && { paymentMethod }),
        });
        
        setMessage(`Ваша заявка на ${activeTab === 'deposit' ? 'пополнение' : 'вывод'} на сумму $${amount} успешно создана!`);
        setAmount('');
        setAddress('');
        setTimeout(() => setMessage(''), 5000);
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'deposit':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-white">Сумма пополнения ($)</h3>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Например: 100"
                            className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                        />
                        <h3 className="text-lg font-semibold text-white">Способ пополнения</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button type="button" onClick={() => setPaymentMethod('card')} className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'card' ? 'border-brand-primary bg-dark-700' : 'border-dark-600 bg-dark-800'}`}>
                                <CreditCard className="h-8 w-8 text-gray-300" />
                                <span className="font-semibold">Банковская карта</span>
                            </button>
                             <button type="button" onClick={() => setPaymentMethod('crypto')} className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'crypto' ? 'border-brand-primary bg-dark-700' : 'border-dark-600 bg-dark-800'}`}>
                                <Bitcoin className="h-8 w-8 text-gray-300" />
                                <span className="font-semibold">Криптовалюта (USDT)</span>
                            </button>
                        </div>
                        <Button type="submit" className="w-full !py-3">Пополнить баланс</Button>
                    </form>
                );
            case 'withdraw':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-white">Сумма вывода ($)</h3>
                         <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Например: 50"
                            className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                        />
                         <h3 className="text-lg font-semibold text-white">Адрес кошелька / номер карты</h3>
                         <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Введите ваш USDT (TRC-20) адрес или номер карты"
                            className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 text-center">Комиссия за вывод: 2%. Минимальная сумма: $10.</p>
                        <Button type="submit" className="w-full !py-3">Вывести средства</Button>
                    </form>
                );
            case 'history':
                return (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-dark-700">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-400">Тип</th>
                                    <th className="p-4 text-sm font-semibold text-gray-400">Сумма</th>
                                    <th className="p-4 text-sm font-semibold text-gray-400 hidden sm:table-cell">Дата</th>
                                    <th className="p-4 text-sm font-semibold text-gray-400">Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_TRANSACTIONS.map(getTransactionRow)}
                            </tbody>
                        </table>
                    </div>
                );
        }
    };
    
    const tabs: {id: Tab, label: string, icon: React.ReactNode}[] = [
        { id: 'deposit', label: 'Пополнение', icon: <ArrowUpCircle className="h-5 w-5"/> },
        { id: 'withdraw', label: 'Вывод', icon: <ArrowDownCircle className="h-5 w-5"/> },
        { id: 'history', label: 'История', icon: <History className="h-5 w-5"/> },
    ];

    return (
        <div className="space-y-6 animate-slide-in-up">
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Мой Кошелек</h2>
                        <p className="text-gray-400">Управляйте своими финансами</p>
                    </div>
                    <div className="bg-dark-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Текущий баланс</p>
                        <p className="text-3xl font-bold text-green-400">${user.balance.toLocaleString('ru-RU')}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="border-b border-dark-700 mb-6">
                    <nav className="-mb-px flex justify-center gap-2 sm:gap-4 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                {message && (
                     <div className="flex items-center gap-3 bg-green-500/10 text-green-400 p-4 rounded-lg mb-4 animate-fade-in max-w-md mx-auto">
                        <CheckCircle className="h-5 w-5" />
                        <p>{message}</p>
                    </div>
                )}
                
                <div className="animate-fade-in">
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};

export default Wallet;