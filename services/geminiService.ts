

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateMarketingContentStream = async (prompt: string, onChunk: (text: string) => void) => {
    const systemInstruction = `Вы — эксперт по маркетингу и копирайтингу для MLM-проектов. Ваша задача — создавать убедительные, мотивирующие и понятные тексты для привлечения новых участников. Используйте позитивный и энергичный тон. Тексты должны быть на русском языке.`;

    try {
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        for await (const chunk of responseStream) {
            onChunk(chunk.text);
        }

    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        throw new Error("Не удалось сгенерировать контент. Пожалуйста, проверьте консоль для получения подробной информации.");
    }
};