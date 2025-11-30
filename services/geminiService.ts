import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainConcept = async (concept: string, context: string = 'system design'): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the concept of "${concept}" in the context of ${context}. Keep it concise (max 3 sentences) and easy to understand for a beginner engineer.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to fetch explanation. Please try again later.";
  }
};