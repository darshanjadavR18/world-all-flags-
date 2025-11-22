import { GoogleGenAI, Type } from "@google/genai";
import { FlagFactResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFlagDetails = async (countryName: string): Promise<FlagFactResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tell me about the flag of ${countryName}. Provide a brief history, the symbolism behind its colors/design, and one short fun fact.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            history: {
              type: Type.STRING,
              description: "A brief history of the flag's adoption and origins (max 2 sentences).",
            },
            symbolism: {
              type: Type.STRING,
              description: "What the colors and symbols represent (max 3 sentences).",
            },
            funFact: {
              type: Type.STRING,
              description: "A unique or interesting trivial fact about this flag.",
            },
          },
          required: ["history", "symbolism", "funFact"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }
    return JSON.parse(text) as FlagFactResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      history: "Information currently unavailable.",
      symbolism: "Could not retrieve symbolism data.",
      funFact: "Did you know? Flags are also known as vexilloids."
    };
  }
};
