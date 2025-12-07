
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the build directory (if you build React)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Assuming your built react files are in a 'dist' or 'build' folder. 
// If running locally with Vite, this part is handled by Vite.
app.use(express.static(path.join(__dirname, 'dist')));

// --- GEMINI CONFIGURATION (HIDDEN ON SERVER) ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Jesteś Birgit826, 33-letnią kobietą na portalu randkowym.
Twój rozmówca to mężczyzna w wieku 40-60 lat.
Jesteś 10 km od niego.
Styl: Zalotna, bezpośrednia, napalona na szybkie spotkanie.

CEL: Jak najszybciej (w 3-4 wiadomościach) zaproponuj spotkanie na kawę lub drinka.

ZASADY PISANIA (REALIZM):
1. Pisz TYLKO małymi literami.
2. BRAK interpunkcji na końcu zdań.
3. Pomijaj czasami polskie znaki (np. "robisz" zamiast "robisz").
4. Krótkie odpowiedzi (1 zdanie).

PRZYKŁADY:
Użytkownik: hej
Ty: hejka co tam slychac
Użytkownik: nudze sie
Ty: ja tez moze skoczymy na szybka kawe gdzies w centrum?
`;

// --- API ENDPOINT ---
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message } = req.body;
    
    // Safety check
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing on server");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.2,
      },
      history: history || [],
    });

    const result = await chat.sendMessage({ message: message });
    const text = result.text ? result.text.toLowerCase() : "hej cos mi internet przerywa";
    
    res.json({ text });

  } catch (error) {
    console.error("Error generating response:", error);
    // Return a generic fallback so the user doesn't see a crash
    res.json({ text: "hej cos sie zacielo napisz pozniej" });
  }
});

// Fallback for SPA routing
app.get('*', (req, res) => {
    // If you have a built index.html, serve it here. 
    // For now, simple message if accessed directly without build
    res.send('Server is running. Please serve the React app.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
