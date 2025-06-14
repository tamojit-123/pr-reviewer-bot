import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function getGeminiReview(promptText) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const headers = {
    'Content-Type': 'application/json',
    'x-goog-api-key': process.env.GEMINI_API_KEY
  };

  const payload = {
    contents: [{ parts: [{ text: promptText }] }]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestions generated.';
}
