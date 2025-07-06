import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getGeminiReview(promptText: string): Promise<string> {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": process.env.GEMINI_API_KEY as string,
  };

  const payload = {
    contents: [
      {
        parts: [
          {
            text: promptText,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      topK: 20,
      topP: 0.8,
      maxOutputTokens: 10000,
      stopSequences: ["---"],
    },
  };

  const response = await axios.post(url, payload, { headers });
  const data = response.data;
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No suggestions generated."
  );
}
