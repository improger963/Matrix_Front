
import React, { useState } from 'react';
import Card from './ui/Card';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-dark-700 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left"
            >
                <h3 className="font-semibold text-white">{question}</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                     <p className="text-gray-400 mt-2">{answer}</p>
                </div>
            </div>
        </div>
    );
};


const FAQ: React.FC = () => {
    const faqData = [
        {
            question: "Что такое матричный проект?",
            answer: "Матричный проект — это маркетинговая система, где участники строят структуру (матрицу) под собой. Доход генерируется за счет заполнения этой матрицы новыми участниками, что приводит к вознаграждениям и переходу на новые уровни."
        },
        {
            question: "Обязательно ли приглашать новых участников?",
            answer: "Да, основа матричной модели — это командная работа и построение структуры. Приглашение новых участников — ключ к вашему успеху и быстрому продвижению по уровням. Однако, возможны 'переливы' от вышестоящих партнеров, которые могут помочь заполнить вашу матрицу."
        },
        {
            question: "Как я могу вывести свои средства?",
            answer: "Вывод средств доступен в вашем личном кабинете. Вы можете вывести заработанные деньги на популярные платежные системы или криптовалютные кошельки. Обработка заявок обычно занимает от нескольких минут до 24 часов."
        },
        {
            question: "Какие риски существуют?",
            answer: "Основной риск — это замедление темпов роста вашей структуры. Успех напрямую зависит от вашей активности и активности вашей команды. Проект не гарантирует доход без усилий."
        }
    ];

    return (
        <Card className="animate-slide-in-up">
            <h2 className="text-2xl font-bold text-white mb-4">Часто задаваемые вопросы (FAQ)</h2>
            <div>
                {faqData.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </Card>
    );
};

export default FAQ;
