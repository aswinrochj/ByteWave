'use server';

import { Groq } from 'groq-sdk';
import { AnalysisResult } from '@/lib/ai-analyzer/core';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeCodeWithGroq(code: string, problem: string): Promise<AnalysisResult> {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured.");
    }

    const prompt = `
    You are an advanced AI Coding Performance Analyzer integrated into an online coding platform.
    The platform supports Java, Python, and C programming languages.

    Analyze the following code submission for the problem: "${problem}".

    Code:
    ${code}

    Your responsibilities:
    1. Code Evaluation: Check correctness, time/space complexity, edge cases, readability, structure, naming, modularity, error handling, and optimization.
    2. Performance Analysis: Estimate Big-O time and space complexity, detect bottlenecks.
    3. Structural Analysis: Evaluate variable naming, detect redundant logic, and assess code quality.
    4. Optimization: Provide specific optimization suggestions and edge case coverage analysis.
    5. Scoring: Provide scores for Logic, Pattern Strength, Optimization, and Consistency.

    Return ONLY a JSON object with this exact structure:
    {
        "dna": {
            "logicScore": 0-100,
            "patternStrength": 0-100,
            "optimizationRating": 0-100,
            "consistencyScore": 0-100,
            "skillScore": 0-100
        },
        "metrics": {
            "timeComplexity": "string (e.g. O(n))",
            "spaceComplexity": "string (e.g. O(1))",
            "executionTime": "string (e.g. 45ms)",
            "memoryUsage": "string (e.g. 12MB)"
        },
        "analysis": {
            "correctnessScore": 0-100,
            "codeQualityScore": 0-100,
            "namingQuality": "string (Poor|Fair|Good|Excellent)",
            "redundantLogicDetected": boolean,
            "logicDepth": "string",
            "optimizationSuggestions": ["string"],
            "edgeCaseCoverage": ["string"],
            "strengths": ["string"],
            "weaknesses": ["string"]
        },
        "feedback": "string (Concise, constructive summary)"
    }
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a code analysis engine that outputs only valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No analysis returned from AI.");

        const result = JSON.parse(content);
        return result as AnalysisResult;

    } catch (error: any) {
        console.error("AI Analysis Failed:", error);
        return {
            dna: { logicScore: 0, patternStrength: 0, optimizationRating: 0, consistencyScore: 0, skillScore: 0 },
            metrics: { timeComplexity: "N/A", spaceComplexity: "N/A", executionTime: "N/A", memoryUsage: "N/A" },
            feedback: `Analysis failed: ${error.message || "Unknown error"}. (Hint: You may need to restart the server if you just added the API key)`
        };
    }
}
