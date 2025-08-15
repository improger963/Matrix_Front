
import type { GuildMember, AcademyArticle } from '../types.ts';
import { MOCK_ACADEMY_ARTICLES } from '../constants.ts';


// This function now simulates a call to a backend endpoint.
// The backend would be responsible for securely calling the Gemini API.
export const generateMarketingContentStream = async (prompt: string, onChunk: (text: string) => void) => {
    const systemInstruction = `Вы — эксперт по маркетингу и копирайтингу для MLM-проектов. Ваша задача — создавать убедительные, мотивирующие и понятные тексты для привлечения новых участников. Используйте позитивный и энергичный тон. Тексты должны быть на русском языке.`;

    try {
        // As per README.md, all AI calls should go through a secure backend endpoint.
        const response = await fetch('/api/ai/generate-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The backend will receive this payload and use it to call Gemini.
            body: JSON.stringify({ prompt, systemInstruction }),
        });

        if (!response.ok) {
             // Since we don't have a real backend, we'll simulate an error for demonstration.
            const errorText = `Error: API endpoint not found. This is expected as the backend is not yet implemented. The app has been secured to prevent exposing the API key.`;
            console.error(errorText);
            throw new Error(errorText);
        }

        if (!response.body) {
            throw new Error("Response body is empty.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            onChunk(decoder.decode(value, { stream: true }));
        }

    } catch (error) {
        console.error("Error calling backend service:", error);
        // Provide a more user-friendly error if the fetch fails (e.g., backend not running)
        throw new Error("Не удалось сгенерировать контент. Убедитесь, что бэкенд-сервер запущен и доступен.");
    }
};


// This is a placeholder base64 string for a futuristic abstract JPEG image.
const MOCK_IMAGE_B64 = "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";

// This function simulates a call to a backend endpoint for image generation.
// The backend would be responsible for securely calling the Gemini API's Imagen model.
export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    console.log(`Simulating image generation for prompt: "${prompt}" with aspect ratio: ${aspectRatio}`);
    
    // Simulate network delay and generation time
    await new Promise(resolve => setTimeout(resolve, 5000));

    // In a real implementation, this would be a fetch call to your backend:
    /*
    try {
        const response = await fetch('/api/ai/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, aspectRatio }),
        });
        if (!response.ok) {
            throw new Error('Image generation failed on the server.');
        }
        const { base64Image } = await response.json();
        return base64Image;
    } catch (error) {
        console.error("Error calling image generation backend service:", error);
        throw new Error("Не удалось сгенерировать изображение. Убедитесь, что бэкенд-сервер запущен.");
    }
    */

    // For demonstration, we'll check for a specific prompt to simulate an error
    if (prompt.toLowerCase().includes("error")) {
        throw new Error("Симуляция ошибки: не удалось обработать запрос. Попробуйте другой промпт.");
    }

    // Return the mock base64 image on success
    return MOCK_IMAGE_B64;
};

// This function simulates a call to a backend with team data to get AI-powered analysis.
// In a real application, this would make a secure backend call which then queries Gemini.
export const getAITeamAnalysisStream = async (
    teamData: GuildMember[],
    onChunk: (text: string) => void
): Promise<void> => {
    console.log("Simulating AI team analysis for:", teamData);

    if (teamData.length === 0) {
        throw new Error("Нет данных о команде для анализа.");
    }
    
    // 1. In-depth data analysis
    const totalMembers = teamData.length;
    const activeCount = teamData.filter(m => m.status === 'active').length;
    const inactiveCount = totalMembers - activeCount;
    const activityRate = totalMembers > 0 ? (activeCount / totalMembers) * 100 : 0;
    const topPerformer = [...teamData].sort((a, b) => b.investors - a.investors)[0];
    const newMembers = teamData.filter(m => new Date(m.joinDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const totalLevel = teamData.reduce((sum, m) => sum + m.level, 0);
    const averageLevel = totalMembers > 0 ? (totalLevel / totalMembers) : 0;

    // 2. Build a dynamic response string
    let analysisText = "**Отчет AI-Аналитика по вашей команде:**\n\n";
    analysisText += `**✅ Ключевые моменты:**\n`;
    analysisText += `*   **Активность:** ${activityRate.toFixed(0)}% ваших партнеров активны (${activeCount} из ${totalMembers}). Это хороший показатель!\n`;
    if (topPerformer) {
        analysisText += `*   **Лидер:** ${topPerformer.name} — ваш лучший рекрутер с ${topPerformer.investors} инвесторами. Отличная работа!\n`;
    }
    if (newMembers.length > 0) {
        analysisText += `*   **Рост:** Вы привлекли ${newMembers.length} новых партнеров за последнюю неделю. Прекрасный темп!\n\n`;
    }

    analysisText += `**⚠️ Зоны роста:**\n`;
    if (inactiveCount > 0) {
        analysisText += `*   **"Спящие" партнеры:** ${inactiveCount} участников неактивны. Это ваш скрытый потенциал для роста.\n`;
    } else {
        analysisText += `*   Все партнеры активны. Потрясающе! Теперь задача — помочь им расти.\n`;
    }
    
    // 3. Generate Smart Recommendations
    let academySuggestions: AcademyArticle[] = [];
    if (inactiveCount > totalMembers * 0.4) { // More than 40% inactive
        const motivationArticle = MOCK_ACADEMY_ARTICLES.find(a => a.id === 'A002'); // Психология продаж
        if (motivationArticle) academySuggestions.push(motivationArticle);
    }
    if (averageLevel < 2) {
        const beginnerArticle = MOCK_ACADEMY_ARTICLES.find(a => a.id === 'A001'); // Как пригласить первого
        if(beginnerArticle) academySuggestions.push(beginnerArticle);
    }
    academySuggestions = [...new Set(academySuggestions)];

    analysisText += `\n**🚀 Рекомендации к действию:**\n`;
    if (inactiveCount > 1) {
        analysisText += `1.  **Реактивация:** Создайте в AI-Копирайтере мотивирующее сообщение для неактивных партнеров и сделайте рассылку.\n`;
    }
    if (topPerformer.investors > 2) {
        analysisText += `2.  **Признание:** Публично похвалите ${topPerformer.name} в общем чате. Это мотивирует и его, и остальных.\n`;
    }

    if (academySuggestions.length > 0) {
        analysisText += `3.  **Обучение:** Для вашей команды сейчас особенно полезны будут материалы из "Академии":\n`;
        academySuggestions.forEach(article => {
            analysisText += `    *   *"${article.title}"*\n`;
        });
    } else {
         analysisText += `3.  **Обучение:** Проверьте, все ли новые партнеры начали обучение в "Академии". Их быстрый старт — залог вашего успеха.\n`;
    }

    // 4. Simulate streaming the response
    const chunks = analysisText.split(/(\s+)/); // Split by space but keep them
    for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 25)); // Simulate network delay
        onChunk(chunk);
    }
};
