import crypto from "crypto";
import dotenv from "dotenv";
import { Request } from "express";
dotenv.config();

export function verifySignature(req: Request): boolean {
  const signature = req.headers["x-hub-signature-256"];
  const body = JSON.stringify(req.body);
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret || typeof signature !== "string") {
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(body).digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
