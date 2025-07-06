"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiReview = getGeminiReview;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function getGeminiReview(promptText) {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
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
    const response = await axios_1.default.post(url, payload, { headers });
    const data = response.data;
    return (data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No suggestions generated.");
}
