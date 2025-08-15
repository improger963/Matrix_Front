

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