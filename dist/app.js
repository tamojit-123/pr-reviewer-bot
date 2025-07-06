"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const verifySignature_1 = require("./verifySignature");
const github_1 = require("./github");
const gemini_1 = require("./gemini");
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.post("/webhook", async (req, res) => {
    if (!(0, verifySignature_1.verifySignature)(req)) {
        res.status(401).send("Invalid signature");
    }
    const event = req.headers["x-github-event"];
    const action = req.body.action;
    if (event === 'pull_request' && ['opened', 'synchronize', 'reopened'].includes(action)) {
        const pr = req.body.pull_request;
        const repo = req.body.repository;
        const owner = repo.owner.login;
        const repoName = repo.name;
        const prNumber = pr.number;
        console.log(`🔔 PR ${action.toUpperCase()}: #${pr.number} - ${pr.title}`);
        console.log(`🔗 ${pr.html_url}`);
        console.log(`🔔 Processing PR #${prNumber} - ${pr.title}`);
        const changedFiles = await (0, github_1.getChangedFiles)(owner, repoName, prNumber);
        let fullDiff = '';
        for (const file of changedFiles) {
            fullDiff += `\n\nFile: ${file.filename}\n\`\`\`diff\n${file.patch}\n\`\`\``;
        }
        const prompt = `
You are a senior code reviewer. Review the following GitHub Pull Request diff and provide:

1. Code refactoring suggestions
2. Linting issues
3. any error or vulnerability
4. Mitigation or improvements

${fullDiff}
`;
        const review = await (0, gemini_1.getGeminiReview)(prompt);
        await (0, github_1.commentOnPR)(owner, repoName, prNumber, `🤖 **AI Code Review Summary**\n\n${review}`);
    }
    res.status(200).send("Webhook received");
});
app.listen(PORT, () => {
    console.log(`🚀 Webhook server listening on port ${PORT}`);
});
