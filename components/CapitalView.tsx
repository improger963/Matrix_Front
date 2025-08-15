

import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { MOCK_TRANSACTIONS, MOCK_USERS_DB } from '../constants.ts';
import type { Transaction, Partner } from '../types.ts';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, History, CreditCard, Bitcoin, Wallet, CheckCircle, ArrowLeft, Copy, Check, Send, UserSearch, LoaderCircle, TrendingUp, Shield, KeyRound, PieChart, Users } from 'lucide-react';
import QRCode from "react-qr-code";
import { useAppContext } from '../contexts/AppContext.tsx';
import { AnimatedBalance } from './ui/Stat.tsx';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

type Tab = 'deposit' | 'withdraw' | 'transfer' | 'history';
type Step = 'form' | 'crypto_details' | 'confirm_withdrawal' | 'success' | 'transfer_confirm';

interface TransactionDetails {
    type: 'deposit' | 'withdraw' | 'transfer';
    amount: number;
    address?: string;
    method?: 'card' | 'crypto';
    recipient?: Pick<Partner, 'id' | 'name' | 'avatarUrl'>;
}

const SecurityCenter: React.FC = () => (
    <Card className="h-full">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-brand-accent"/>Центр Безопасности</h3>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Сменить пароль</span>
                <Button variant="secondary" className="!text-xs !px-3 !py-1"><KeyRound className="w-4 h-4 mr-1.5"/>Изменить</Button>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">2FA Аутентификация</span>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                </label>
            </div>
            <p className="text-xs text-gray-500 pt-2 border-t border-dark-700">Последняя сессия: 15 минут назад (IP: 192.168.1.1)</p>
        </div>
    </Card>
);

const TransactionAnalytics: React.FC = () => {
    const data = [
        { name: 'Прибыль от Exits', value: 400, color: '#10b981' },
        { name: 'Прибыль от Синдиката', value: 300, color: '#2dd4bf' },
        { name: 'Покупки Стартапов', value: -200, color: '#f87171' },
        { name: 'Апгрейды', value: -100, color: '#f43f5e' },
    ];
    const income = data.filter(d => d.value > 0).reduce((acc, d) => acc + d.value, 0);
    const expenses = data.filter(d => d.value < 0).reduce((acc, d) => acc + d.value, 0);

    return (
        <Card className="h-full">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-brand-accent"/>Аналитика Транзакций (30д)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="w-full h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie data={data.filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                                {data.filter(d => d.value > 0).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                             <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
                 <div>
                    <div className="mb-2">
                        <p className="text-sm text-gray-400">Всего доходов:</p>
                        <p className="text-xl font-bold text-green-400">${income.toFixed(2)}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-400">Всего расходов:</p>
                        <p className="text-xl font-bold text-red-400">${expenses.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const CapitalView: React.FC = () => {
    const { user } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('deposit');
    const [step, setStep] = useState<Step>('form');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('crypto');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
    
    // State for internal transfers
    const [recipientId, setRecipientId] = useState('');
    const [foundRecipient, setFoundRecipient] = useState<Pick<Partner, 'id' | 'name' | 'avatarUrl'> | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [transferComment, setTransferComment] = useState('');

    const MOCK_WALLET_ADDRESS = "TXYZ123abcdeFGHIJKLMNopqrstuvwxyz789";

    const resetFlow = () => {
        setStep('form');
        setAmount('');
        setAddress('');
        setError('');
        setTransactionDetails(null);
        // Reset transfer states
        setRecipientId('');
        setFoundRecipient(null);
        setIsSearching(false);
        setSearchError('');
        setTransferComment('');
    };

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        resetFlow();
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(MOCK_WALLET_ADDRESS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!amount || Number(amount) <= 0) {
            setError('Пожалуйста, введите корректную сумму.');
            return;
        }
        
        const numericAmount = Number(amount);

        if (activeTab === 'deposit') {
            const details: TransactionDetails = { type: 'deposit', amount: numericAmount, method: paymentMethod };
            setTransactionDetails(details);
            if (paymentMethod === 'crypto') {
                setStep('crypto_details');
            } else {
                console.log('Proceeding to card payment gateway with:', details);
                setStep('success'); // Simulate success for card payment
            }
        } else if (activeTab === 'withdraw') {
            if (!address.trim()) {
                setError('Пожалуйста, введите адрес для вывода.');
                return;
            }
            if (numericAmount > user.capital) {
                setError('Недостаточно средств на балансе.');
                return;
            }
            setTransactionDetails({ type: 'withdraw', amount: numericAmount, address: address });
            setStep('confirm_withdrawal');
        }
    };
    
    const handleFindRecipient = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSearchError('');

        if (!recipientId.trim() || !amount.trim() || Number(amount) <= 0) {
            setError('Введите ID получателя и корректную сумму.');
            return;
        }

        if (recipientId.trim().toLowerCase() === user.id.toLowerCase()) {
            setError('Вы не можете отправить средства самому себе.');
            return;
        }

        const numericAmount = Number(amount);
        if (numericAmount > user.capital) {
            setError('Недостаточно средств на балансе.');
            return;
        }
        
        setIsSearching(true);
        await new Promise(res => setTimeout(res, 1000)); // Simulate API call
        
        const recipientKey = Object.keys(MOCK_USERS_DB).find(key => key.toLowerCase() === recipientId.trim().toLowerCase());
        const recipient = recipientKey ? MOCK_USERS_DB[recipientKey] : null;
        
        setIsSearching(false);

        if (recipient) {
            setFoundRecipient(recipient);
            setStep('transfer_confirm');
            setError('');
        } else {
            setSearchError(`Партнер с ID "${recipientId}" не найден.`);
            setFoundRecipient(null);
        }
    };
    
    const handleConfirmTransfer = () => {
        console.log('Transfer confirmed:', { from: user.id, to: foundRecipient?.id, amount: Number(amount), comment: transferComment });
        setTransactionDetails({
            type: 'transfer',
            amount: Number(amount),
            recipient: foundRecipient!,
        });
        setStep('success');
    };
    
    const handleConfirmWithdrawal = () => {
        console.log('Withdrawal confirmed:', transactionDetails);
        setStep('success');
    };

    const getTransactionRow = (transaction: Transaction) => {
        const typeMap = {
            deposit: { text: 'Покупка $CAP', icon: <ArrowUpCircle className="h-5 w-5 text-green-500" /> },
            withdrawal: { text: 'Продажа $CAP', icon: <ArrowDownCircle className="h-5 w-5 text-red-500" /> },
            profit: { text: 'Прибыль от Exit', icon: <DollarSign className="h-5 w-5 text-yellow-500" /> },
            investment: { text: 'Инвестиция в раунд', icon: <TrendingUp className="h-5 w-5 text-blue-500" /> },
            upgrade: { text: 'Масштабирование', icon: <TrendingUp className="h-5 w-5 text-purple-400" /> },
            syndicate_profit: { text: 'Бонус синдиката', icon: <Users className="h-5 w-5 text-cyan-400" /> },
        };
    
        const statusMap = {
            completed: { text: 'Выполнено', className: 'bg-green-500/20 text-green-400' },
            pending: { text: 'В обработке', className: 'bg-yellow-500/20 text-yellow-400' },
            failed: { text: 'Отклонено', className: 'bg-red-500/20 text-red-400' },
        };
        
        const amountClass = transaction.amount > 0 ? 'text-green-400' : 'text-red-400';
        const sign = transaction.amount > 0 ? '+' : '';
    
        let typeInfo: { text: string; icon: React.ReactNode };
    
        if (transaction.type === 'transfer') {
            const isOutgoing = transaction.sender?.id === user.id;
            typeInfo = {
                text: isOutgoing ? `Перевод для ${transaction.recipient?.name}` : `Перевод от ${transaction.sender?.name}`,
                icon: <Send className="h-5 w-5 text-blue-400" />
            };
        } else {
            typeInfo = typeMap[transaction.type as keyof typeof typeMap];
        }
    
        return (
            <tr key={transaction.id} className="border-b border-dark-700 last:border-b-0 hover:bg-dark-700/50">
                <td className="p-4">
                    <div className="flex items-center gap-3">
                        {typeInfo.icon}
                        <div>
                             <span className="font-medium text-white">{typeInfo.text}</span>
                             {transaction.comment && <p className="text-xs text-gray-500 truncate max-w-[200px]">{transaction.comment}</p>}
                        </div>
                    </div>
                </td>
                <td className={`p-4 font-mono font-semibold ${amountClass}`}>{sign}${Math.abs(transaction.amount).toFixed(2)}</td>
                <td className="p-4 text-gray-400 hidden sm:table-cell">{new Date(transaction.date).toLocaleDateString('ru-RU')}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[transaction.status].className}`}>
                        {statusMap[transaction.status].text}
                    </span>
                </td>
            </tr>
        );
    };

    const renderDepositForm = () => (
        <form onSubmit={handleFormSubmit} className="space-y-4 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white text-center">Сумма покупки ($CAP)</h3>
            <div>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Например: 1000"
                    className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all text-center text-xl"
                />
            </div>
            <h3 className="text-lg font-semibold text-white text-center">Способ покупки</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button type="button" onClick={() => setPaymentMethod('crypto')} className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'crypto' ? 'border-brand-primary bg-dark-700' : 'border-dark-600 bg-dark-800'}`}>
                    <Bitcoin className="h-8 w-8 text-yellow-400" />
                    <span className="font-semibold">Криптовалюта (USDT)</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('card')} className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'card' ? 'border-brand-primary bg-dark-700' : 'border-dark-600 bg-dark-800'}`}>
                    <CreditCard className="h-8 w-8 text-gray-300" />
                    <span className="font-semibold">Банковская карта</span>
                </button>
            </div>
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <Button type="submit" className="w-full !py-3">Продолжить</Button>
        </form>
    );

    const renderCryptoDetails = () => (
         <div className="max-w-md mx-auto text-center space-y-4">
            <button onClick={() => setStep('form')} className="flex items-center gap-2 text-sm text-brand-accent hover:text-white mb-4">
                <ArrowLeft className="h-4 w-4" /> Назад
            </button>
             <h3 className="text-lg font-semibold text-white">Покупка ${transactionDetails?.amount} CAP</h3>
            <p className="text-sm text-gray-400">Отсканируйте QR-код или скопируйте адрес ниже, чтобы совершить перевод.</p>
            <div className="bg-white p-4 rounded-lg inline-block">
                <QRCode
                    value={MOCK_WALLET_ADDRESS}
                    size={160}
                    bgColor="#FFFFFF"
                    fgColor="#0f172a"
                    level="L"
                />
            </div>
            <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Ваш адрес для пополнения (USDT TRC-20)</p>
                <div className="flex items-center gap-2">
                    <input type="text" readOnly value={MOCK_WALLET_ADDRESS} className="bg-transparent text-gray-200 focus:outline-none w-full text-sm truncate"/>
                    <Button onClick={handleCopy} className="!px-3 !py-2 shrink-0">
                        {copied ? <Check className="h-4 w-4 text-accent-green" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <div className="bg-yellow-500/10 text-yellow-400 text-xs p-3 rounded-lg">
                <strong>Внимание:</strong> отправляйте только USDT в сети TRC-20. Перевод других активов на этот адрес может привести к их потере.
            </div>
             <Button onClick={() => setStep('success')} variant="secondary" className="w-full !py-3">Я совершил платеж</Button>
         </div>
    );
    
     const renderWithdrawalForm = () => (
        <form onSubmit={handleFormSubmit} className="space-y-4 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white">Сумма продажи ($CAP)</h3>
             <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Например: 500"
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
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <p className="text-xs text-gray-500 text-center">Комиссия за вывод: 2%. Минимальная сумма: $100 CAP.</p>
            <Button type="submit" className="w-full !py-3">Продолжить</Button>
        </form>
    );

    const renderConfirmation = () => {
        const details = transactionDetails as Required<TransactionDetails>;
        const fee = details.amount * 0.02;
        const total = details.amount - fee;
        const maskedAddress = `${details.address.slice(0, 6)}...${details.address.slice(-4)}`;

        return (
             <div className="max-w-md mx-auto text-center space-y-4">
                <h3 className="text-xl font-bold text-white">Подтвердите продажу $CAP</h3>
                <p className="text-sm text-gray-400">Пожалуйста, проверьте все детали перед подтверждением.</p>
                <div className="text-left bg-dark-900/50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Сумма продажи:</span>
                        <span className="font-semibold text-white">${details.amount.toFixed(2)} CAP</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Комиссия (2%):</span>
                        <span className="font-semibold text-white">-${fee.toFixed(2)} CAP</span>
                    </div>
                     <div className="flex justify-between border-t border-dark-700 pt-3">
                        <span className="text-gray-400">К получению:</span>
                        <span className="font-bold text-accent-green text-lg">${total.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">На адрес:</span>
                        <span className="font-mono text-white" title={details.address}>{maskedAddress}</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => setStep('form')} variant="secondary" className="w-full !py-3">Отмена</Button>
                    <Button onClick={handleConfirmWithdrawal} className="w-full !py-3">Подтвердить</Button>
                </div>
             </div>
        )
    };
    
    const renderTransferForm = () => (
        <form onSubmit={handleFindRecipient} className="space-y-4 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white text-center">Внутренний перевод $CAP</h3>
            
            <div>
                 <label htmlFor="recipientId" className="block text-sm font-medium text-gray-300 mb-1">ID Партнера-получателя</label>
                <input
                    id="recipientId"
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="Введите ID пользователя"
                    className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                />
            </div>
            
             <div>
                <label htmlFor="transferAmount" className="block text-sm font-medium text-gray-300 mb-1">Сумма перевода ($CAP)</label>
                <input
                    id="transferAmount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Например: 500"
                    className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                />
            </div>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            {searchError && <p className="text-red-500 text-center text-sm">{searchError}</p>}
            
            <Button type="submit" className="w-full !py-3" disabled={isSearching}>
                {isSearching ? (
                    <span className="flex items-center justify-center">
                        <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                        Поиск...
                    </span>
                ) : (
                    <span className="flex items-center justify-center">
                        <UserSearch className="h-5 w-5 mr-2" />
                        Найти получателя
                    </span>
                )}
            </Button>
        </form>
    );

    const renderTransferConfirmation = () => {
        if (!foundRecipient) return null;

        const numericAmount = Number(amount);
        const fee = numericAmount * 0.01; // 1% fee
        const total = numericAmount + fee;
        
        return (
            <div className="max-w-md mx-auto space-y-4">
                <button onClick={() => setStep('form')} className="flex items-center gap-2 text-sm text-brand-accent hover:text-white mb-2">
                    <ArrowLeft className="h-4 w-4" /> Назад
                </button>
                <h3 className="text-xl font-bold text-white text-center">Подтверждение перевода</h3>

                <div className="bg-dark-900/50 p-4 rounded-lg space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-gray-400">Отправитель:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{user.name}</span>
                            <img src={user.avatarUrl} alt="sender" className="w-8 h-8 rounded-full" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Получатель:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{foundRecipient.name}</span>
                            <img src={foundRecipient.avatarUrl} alt="recipient" className="w-8 h-8 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="text-left bg-dark-900/50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Сумма перевода:</span>
                        <span className="font-semibold text-white">${numericAmount.toFixed(2)} CAP</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Комиссия (1%):</span>
                        <span className="font-semibold text-white">${fee.toFixed(2)} CAP</span>
                    </div>
                     <div className="flex justify-between border-t border-dark-700 pt-3">
                        <span className="text-gray-400">Итого к списанию:</span>
                        <span className="font-bold text-red-400 text-lg">${total.toFixed(2)} CAP</span>
                    </div>
                </div>

                <div>
                    <label htmlFor="transferComment" className="block text-sm font-medium text-gray-300 mb-1">Комментарий (необязательно)</label>
                    <textarea
                        id="transferComment"
                        value={transferComment}
                        onChange={(e) => setTransferComment(e.target.value)}
                        placeholder="Назначение перевода..."
                        rows={2}
                        className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                    />
                </div>

                <Button onClick={handleConfirmTransfer} className="w-full !py-3">
                    <span className="flex items-center justify-center">
                        <Send className="h-5 w-5 mr-2" />
                        Подтвердить и отправить
                    </span>
                </Button>
            </div>
        )
    };

    const renderSuccess = () => (
        <div className="max-w-md mx-auto text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-fade-in">
                 <CheckCircle className="w-12 h-12 text-accent-green" />
            </div>
            <h3 className="text-xl font-bold text-white">Операция в обработке!</h3>
            <p className="text-gray-400">
                 {transactionDetails?.type === 'transfer' ?
                    `Ваш перевод на сумму $${Number(amount).toFixed(2)} CAP для партнера ${transactionDetails.recipient?.name} успешно отправлен.`
                    :
                    `Ваша заявка на ${transactionDetails?.type === 'deposit' ? 'покупку' : 'продажу'} на сумму $${transactionDetails?.amount.toFixed(2)} CAP была успешно создана.`
                }
            </p>
            <Button onClick={resetFlow} className="w-full !py-3">Вернуться в Казначейство</Button>
        </div>
    );


    const renderContent = () => {
        if (activeTab === 'history') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 overflow-x-auto">
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
                    <div className="lg:col-span-1 space-y-6">
                        <TransactionAnalytics />
                        <SecurityCenter />
                    </div>
                </div>
            );
        }

        if (activeTab === 'transfer') {
            switch (step) {
                case 'form': return renderTransferForm();
                case 'transfer_confirm': return renderTransferConfirmation();
                case 'success': return renderSuccess();
                default: return null;
            }
        }

        switch (step) {
            case 'form':
                return activeTab === 'deposit' ? renderDepositForm() : renderWithdrawalForm();
            case 'crypto_details':
                return renderCryptoDetails();
            case 'confirm_withdrawal':
                return renderConfirmation();
            case 'success':
                return renderSuccess();
            default:
                return null;
        }
    };
    
    const tabs: {id: Tab, label: string, icon: React.ReactNode}[] = [
        { id: 'deposit', label: 'Купить $CAP', icon: <ArrowUpCircle className="h-5 w-5"/> },
        { id: 'withdraw', label: 'Продать $CAP', icon: <ArrowDownCircle className="h-5 w-5"/> },
        { id: 'transfer', label: 'Перевод', icon: <Send className="h-5 w-5"/> },
        { id: 'history', label: 'История', icon: <History className="h-5 w-5"/> },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Казначейство</h2>
                        <p className="text-gray-400">Все ваши финансовые операции в одном месте.</p>
                    </div>
                    <div className="bg-dark-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 text-center">Текущий баланс</p>
                        <div className="text-center text-4xl text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-400 to-teal-500 py-2 animate-text-glow">
                            <AnimatedBalance value={user.capital} />
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="border-b border-dark-700 mb-6">
                    <nav className="-mb-px flex justify-center gap-2 sm:gap-4 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                                
                <div className="animate-fade-in min-h-[350px] flex flex-col justify-center">
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};

export default CapitalView;