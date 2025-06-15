# 🤖 PR Reviewer Bot with Google Gemini

Automated GitHub Pull Request code review bot powered by **Google Gemini**.  
This webhook intelligently analyzes PR changes and comments on code style, potential refactoring, and best practices — using an LLM context-driven approach inspired by **MCP (Model Context Protocol)** patterns.

---

## ✨ Features

- 🔍 **Code Diff Analysis** – Parses PR diffs to understand file changes
- 🤖 **Gemini AI Integration** – Uses Google's Gemini model to generate intelligent code reviews
- 🧠 **Suggests Improvements** – Code refactoring tips, lint issues, and mitigation suggestions
- 🧵 **Autocomments on PR** – Posts feedback as comments on the PR automatically
- 🔌 **GitHub Webhook Friendly** – Easily pluggable into any GitHub repo
- ♻️ Inspired by **Agentic AI** patterns and future MCP-style orchestration

---

## 📦 Tech Stack

- Node.js + Express
- Google Gemini API (via REST)
- GitHub REST API
- `serverless-http` + Vercel compatible
- dotenv + body-parser

---

## 🚀 Getting Started

### 1. **Clone the Repo**

```bash
git clone https://github.com/tamojit-123/pr-reviewer-bot.git
cd pr-reviewer-bot
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Set Environment Variables**

Create a `.env` file in the root:

```env
GITHUB_TOKEN=ghp_your_github_token_here
GEMINI_API_KEY=your_google_gemini_api_key
GITHUB_APP_SECRET=your_github_webhook_secret
```

---

## 🛠️ How It Works

1. GitHub triggers webhook when a Pull Request is opened/updated
2. Bot parses the changed files
3. Sends file diffs as prompts to **Gemini**
4. Receives code review suggestions
5. Posts review comments back on the PR

---

## 🔗 How to Integrate in Your GitHub Repo

### ✅ Step 1: Deploy This Bot

Deploy it using [Vercel](https://vercel.com/) or your preferred Node.js host.  
Make sure you expose the webhook endpoint like:

```
https://your-vercel-deployment-url.vercel.app/api/webhook
```

### ✅ Step 2: Add a Webhook to Your GitHub Repo

1. Go to your GitHub repository
2. Navigate to **Settings → Webhooks → Add webhook**
3. Fill the fields:

| Field             | Value                                       |
|------------------|---------------------------------------------|
| Payload URL       | `https://your-vercel-deployment-url.vercel.app/api/webhook` |
| Content type      | `application/json`                          |
| Secret            | Your `GITHUB_APP_SECRET`                    |
| Events to trigger | ✅ Pull requests                            |

4. Click **Add Webhook**

### ✅ Step 3: That’s it!

Now, when a contributor opens or updates a PR, the bot will:
- Read the diff
- Ask Gemini to review it
- Post feedback as comments

---

## 🧪 Example `curl` Test (For Vercel Deployed Webhook)

```bash
curl -X POST https://your-vercel-app.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=<signature>" \
  -d @mock-pr-payload.json
```

---

## 📁 Project Structure

```
.
├── api/
│   └── webhook.js         # Vercel serverless handler
├── lib/
│   ├── index.js           # Express app
│   ├── github.js          # GitHub API logic
│   ├── gemini.js          # Gemini API integration
│   └── verifySignature.js # Signature validation
└── .env
```

---

## 🧠 Inspired by AI Design Patterns

This bot is modeled after the **Agentic AI pattern**, with future compatibility for **Anthropic’s Model Context Protocol (MCP)**.  
It lays the foundation for context-rich, multi-step, tool-integrated AI workflows.

---

## 🙌 Contributing

Want to add:
- Claude or GPT support?
- Custom review templates?
- Feedback loop with AI self-evaluation?

Feel free to open an issue or PR!

---

## 📄 License

MIT

---

## 👤 Author

Built with ❤️ by [@tamojit-123](https://github.com/tamojit-123)

---