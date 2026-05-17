import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey ?? "",
});

type GenerateGeminiTextArgs = {
  systemPrompt: string;
  prompt: string;
  model?: string;
};

export async function generateGeminiText({
  systemPrompt,
  prompt,
  model = "gemini-2.5-flash",
}: GenerateGeminiTextArgs) {
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}\n\nUser request:\n${prompt}`,
          },
        ],
      },
    ],
  });

  return response.text ?? "";
}