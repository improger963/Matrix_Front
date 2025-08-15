

import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const faqData = [
    {
        question: "Как работает заработок в Nexus Capital?",
        answer: "Ваш доход формируется от успешного получения Полного Финансирования для ваших Проектов. Вы начинаете с запуска 'Pre-seed' Проекта, продаете в нем Доли партнерам из своей Бизнес-сети, и как только все Доли проданы, вы получаете Прибыль. Затем вы можете переходить к более дорогим раундам ('A', 'B') или открывать 'Филиалы', чтобы масштабировать свой доход."
    },
    {
        question: "Обязательно ли привлекать Партнеров?",
        answer: "Да, привлечение партнеров и продажа им Долей — это ключевая механика и основа роста вашей финансовой империи. Однако, благодаря командной работе, вы можете получать 'Транши от Бизнес-сети' — это партнеры, которые приходят в ваш Проект от более активных членов вашей Бизнес-сети, что ускоряет ваш прогресс."
    },
    {
        question: "Как я могу вывести свой Капитал ($CAP)?",
        answer: "Вывод средств доступен в разделе 'Управление Активами'. Вы можете продать свои $CAP и получить средства на USDT кошелек (TRC-20). Обработка заявок обычно занимает от нескольких минут до 24 часов."
    },
    {
        question: "Что такое 'Транши от Бизнес-сети' и 'Филиалы'?",
        answer: "'Транши' — это когда партнеры от ваших вышестоящих лидеров попадают в вашу структуру, помогая вам быстрее достичь Полного Финансирования. 'Филиал' — это создание вашей копии в структуре вашего партнера, что позволяет вам зарабатывать не только от своей основной структуры, но и от активности в других командах."
    }
];

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