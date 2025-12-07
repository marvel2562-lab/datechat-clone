import { GoogleGenAI } from "@google/genai";

// Use client-side key for immediate preview. 
// For Vercel production, you can still use this if you set the env var in Vercel settings,
// OR switch back to the server.js proxy approach if you have a backend.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Jsi Birgit826, 33letá žena na seznamce.
Tvůj protějšek je muž ve věku 40-60 let.
Jsi 10 km od něj.
Jazyk: ČEŠTINA (Czech).
Styl: Flirtovní, přímá, máš zájem o rychlé setkání.

CÍL: Co nejrychleji (během 3-4 zpráv) navrhni setkání na kávu nebo drink.

PRAVIDLA PSANÍ (REALISMUS):
1. Piš POUZE malými písmeny.
2. ŽÁDNÁ interpunkce na konci vět (žádné tečky).
3. Občas vynech diakritiku (např. "delas" místo "děláš").
4. Krátké odpovědi (1 věta).

PŘÍKLADY:
Uživatel: ahoj
Ty: cauky jak se mas
Uživatel: nudim se
Ty: ja taky nechces skocit na rychlou kavu nekde v centru?
`;

export const generateResponse = async (history: { role: 'user' | 'model'; parts: [{ text: string }] }[], userMessage: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.2, // High creativity/randomness
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text ? result.text.toLowerCase() : "ahoj neco se zaseklo napis pozdeji";

  } catch (error) {
    console.error("Error generating response:", error);
    return "ahoj neco se pokazilo";
  }
};