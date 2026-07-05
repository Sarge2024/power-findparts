import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 2000;

  // Body parsing middleware
  app.use(express.json());

  // Initialize Gemini Client server-side safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Server: Gemini API client successfully initialized.");
  } else {
    console.warn("Server: GEMINI_API_KEY not found in environment variables. AI features will be disabled.");
  }

  // API: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiEnabled: !!ai });
  });

  // API: Gemini Mechanic AI Assistant
  app.post("/api/gemini", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "O prompt é obrigatório." });
    }

    if (!ai) {
      return res.status(503).json({ 
        error: "O serviço de IA está indisponível pois a chave GEMINI_API_KEY não foi configurada." 
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é o Power Find Parts AI, um assistente mecânico especialista da Sagacitas Industrial para mecânicos e gestores de peças. Responda de forma curta, clara e técnica sobre compatibilidade de peças (ex: alternadores, baterias, correias, motores) e manutenção de veículos (ex: Gol, Voyage, Saveiro). Responda sempre em português do Brasil de forma muito prestativa.",
          temperature: 0.7,
        }
      });

      const text = response.text || "Não foi possível gerar uma resposta.";
      res.json({ response: text });
    } catch (err: any) {
      console.error("Erro na API Gemini:", err);
      res.status(500).json({ 
        error: "Ocorreu um erro ao processar sua pergunta técnica.", 
        details: err.message || String(err)
      });
    }
  });

  // API: Bluesoft Cosmos Integration (GTIN/EAN)
  app.get("/api/cosmos/gtin/:gtin", async (req, res) => {
    const { gtin } = req.params;
    const cosmosKey = process.env.COSMOS_API_KEY;

    if (!cosmosKey) {
      return res.status(503).json({ error: "Chave COSMOS_API_KEY não configurada." });
    }

    try {
      // Usando fetch nativo (Node 18+)
      const response = await fetch(`https://api.cosmos.bluesoft.com.br/gtins/${gtin}.json`, {
        method: "GET",
        headers: {
          "X-Cosmos-Token": cosmosKey,
          "User-Agent": "PowerFindParts/1.0"
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "Produto não encontrado no Cosmos." });
        }
        throw new Error(`Cosmos API respondeu com status ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Erro ao consultar Cosmos API:", error);
      res.status(500).json({ error: "Erro interno ao consultar o produto.", details: error.message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Server running in DEVELOPMENT mode. Mounting Vite dev server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Server running in PRODUCTION mode. Serving static assets...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
