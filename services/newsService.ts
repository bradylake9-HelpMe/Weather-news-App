
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, NewsSource } from "../types";

export const fetchNewsFromSources = async (sources: NewsSource[]): Promise<NewsItem[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const activeSources = sources.filter(s => s.isActive);
  if (activeSources.length === 0) return [];

  const sourceContext = activeSources.map(s => `${s.name} (${s.type}): ${s.url}`).join('\n');
  
  const prompt = `Act as a real-time RSS news aggregator. Based on the following sources, generate a set of highly realistic current news headlines and brief summaries. 
  Sources:
  ${sourceContext}

  Generate 2-3 news items for each source provided. If the source is a URL, infer the type of news it would likely have. 
  Focus on high-quality, professional journalism style. Return the data in the specified JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              source: { type: Type.STRING, description: "The name of the source (e.g. Texas News, World Report)" },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              url: { type: Type.STRING }
            },
            required: ["id", "source", "title", "summary", "category", "timestamp"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini News fetch failed:", error);
    return [];
  }
};
