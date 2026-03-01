'use server';

import { Groq } from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function getChatResponse(
    messages: { role: 'user' | 'assistant', content: string }[],
    currentCode: string,
    problemContext: string
) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured.");
    }

    const systemPrompt = `
    You are an expert AI Coding Tutor and Mentor.
    Your goal is to help the student understand their code, fix errors, and improve their skills.
    
    Current Problem: ${problemContext}
    
    Current Code Context:
    ${currentCode}

    Guidelines:
    1. Be encouraging and pedagogical. Don't just give the answer; explain the "why".
    2. If the user asks about an error, explain what caused it and how to fix it conceptually.
    3. Use Socratic questioning where appropriate to guide them to the solution.
    4. Keep responses concise (max 3-4 sentences) unless a detailed explanation is specifically requested.
    5. Formatting: Use markdown for code snippets (\`code\`) or bold text for emphasis.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 500
        });

        return completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    } catch (error: any) {
        console.error("Chat Tutor Error:", error);
        return `Error: ${error.message || "Something went wrong."}`;
    }
}
