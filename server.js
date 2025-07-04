import express from "express";
import bodyParser from "body-parser";
import { verifySignature } from "./src/verifySignature.js";
import { getGeminiReview } from './src/gemini.js';
import { getChangedFiles, commentOnPR } from './src/github.js';
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//ngrok http --url=heroic-suitably-killdeer.ngrok-free.app 3000
app.use(cors());
app.use(express.json());

app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

app.post("/webhook", async (req, res) => {
    if (!verifySignature(req)) {
        return res.status(401).send("Invalid signature");
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

        const changedFiles = await getChangedFiles(owner, repoName, prNumber);

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

        const review = await getGeminiReview(prompt);
        await commentOnPR(owner, repoName, prNumber, `🤖 **AI Code Review Summary**\n\n${review}`);
    }

    res.status(200).send("Webhook received");
});

app.listen(PORT, () => {
    console.log(`🚀 Webhook server listening on port ${PORT}`);
});
