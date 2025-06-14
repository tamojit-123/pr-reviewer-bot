import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export function verifySignature(req) {
    const signature = req.headers["x-hub-signature-256"];
    const body = JSON.stringify(req.body);
    const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET);
    const digest = `sha256=${hmac.update(body).digest("hex")}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
