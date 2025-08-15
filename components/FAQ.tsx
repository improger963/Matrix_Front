

import React, { useState } from 'react';
import Card from './ui/Card.tsx';
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
            question: "Как работает заработок в Nexus Capital?",
            answer: "Ваш доход формируется от успешного закрытия раундов финансирования (Exit). Вы начинаете с инвестиции в 'Pre-seed' стартап, привлекаете в него инвесторов из своего синдиката, и как только все места заполняются, вы получаете вознаграждение. Затем вы можете переходить к более дорогим раундам ('A', 'B') или открывать 'Spin-off', чтобы масштабировать свой доход."
        },
        {
            question: "Обязательно ли привлекать Инвесторов?",
            answer: "Да, привлечение инвесторов — это ключевая механика и основа роста вашей финансовой империи. Однако, благодаря командной работе, вы можете получать 'Сделки из синдиката' — это инвесторы, которые приходят в ваш стартап от более активных членов вашего синдиката, что ускоряет ваш прогресс."
        },
        {
            question: "Как я могу вывести свой капитал ($CAP)?",
            answer: "Вывод средств доступен в разделе 'Капитал'. Вы можете продать свои $CAP и получить средства на популярные платежные системы или криптовалютные кошельки. Обработка заявок обычно занимает от нескольких минут до 24 часов."
        },
        {
            question: "Что такое 'Сделки из синдиката' и 'Spin-off'?",
            answer: "'Сделки из синдиката' — это когда инвесторы от ваших вышестоящих партнеров попадают в вашу структуру, помогая вам быстрее закрывать раунды. 'Spin-off' — это создание вашей копии в структуре вашего партнера, что позволяет вам зарабатывать не только от своей основной структуры, но и от активности в других командах."
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