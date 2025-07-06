"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = verifySignature;
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function verifySignature(req) {
    const signature = req.headers["x-hub-signature-256"];
    const body = JSON.stringify(req.body);
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret || typeof signature !== "string") {
        return false;
    }
    const hmac = crypto_1.default.createHmac("sha256", secret);
    const digest = `sha256=${hmac.update(body).digest("hex")}`;
    return crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
