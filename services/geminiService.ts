import { GoogleGenAI } from "@google/genai";
import { FinanceData, JournalEntry, Habit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  generateLifeInsights: async (
    finances: FinanceData[],
    journal: JournalEntry[],
    habits: Habit[]
  ): Promise<string> => {
    try {
      // Prepare context safely
      const financeSummary = finances.slice(0, 10).map(f => `${f.type}: Rs ${f.amount} (${f.category})`).join(', ');
      const journalSummary = journal.slice(0, 5).map(j => `Mood: ${j.mood}/5, Entry: "${j.text}"`).join(' | ');
      const habitSummary = habits.map(h => `${h.name}: Streak ${h.streak}`).join(', ');

      const prompt = `
        Act as a cognitive performance coach. Analyze the following user data:
        
        Recent Finances: ${financeSummary}
        Recent Journal: ${journalSummary}
        Habit Status: ${habitSummary}
        
        Provide a "Weekly Life Summary" and 3 actionable bullet points to improve the user's well-being, financial health, or productivity.
        Keep the tone professional, motivating, and concise. No markdown formatting, just plain text with line breaks.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text || "Unable to generate insights at this time.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "AI services are currently offline. Please try again later.";
    }
  }
};