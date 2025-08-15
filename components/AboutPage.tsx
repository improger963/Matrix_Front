import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="pt-32 pb-12 bg-dark-900 text-white min-h-[60vh]">
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl font-bold">О проекте</h1>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Здесь будет подробная информация о миссии, видении и команде проекта Nexus Capital. Мы расскажем, почему наша платформа является лучшим инструментом для построения вашей онлайн бизнес-империи.</p>
            </div>
        </div>
    );
};

export default AboutPage;
