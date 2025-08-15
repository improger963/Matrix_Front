
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
            question: "Как работает заработок в 'Realty Guilds'?",
            answer: "Ваш доход формируется из 'Арендной платы'. Вы начинаете с покупки 'Участка', привлекаете в него Инвесторов, и как только все места заполняются, вы получаете вознаграждение. Затем вы можете переходить к более дорогим Проектам ('Дома', 'Отели') или открывать 'Филиалы', чтобы масштабировать свой доход."
        },
        {
            question: "Обязательно ли привлекать Инвесторов?",
            answer: "Да, привлечение Инвесторов — это ключевая механика игры и основа роста вашей финансовой империи. Однако, благодаря командной работе, вы можете получать 'Городские контракты' — это инвесторы, которые приходят в ваш Проект от более активных членов вашей Гильдии, что ускоряет ваш прогресс."
        },
        {
            question: "Как я могу вывести свои Городские Кредиты (ГК)?",
            answer: "Вывод средств доступен в разделе 'Банк'. Вы можете продать свои Городские Кредиты и получить средства на популярные платежные системы или криптовалютные кошельки. Обработка заявок обычно занимает от нескольких минут до 24 часов."
        },
        {
            question: "Что такое Синдикаты и в чем их преимущество?",
            answer: "Синдикат — это полный контроль вашей Гильдии над одним из Районов на Карте Города. Когда все Проекты в Районе принадлежат членам одной Гильдии, она формирует Синдикат и начинает получать пассивный доход со всех операций в этом Районе. Это — высшая цель для любой Гильдии."
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
