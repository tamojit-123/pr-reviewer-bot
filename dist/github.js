"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangedFiles = getChangedFiles;
exports.commentOnPR = commentOnPR;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const headers = {
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'PR-Reviewer-Bot'
};
async function getChangedFiles(owner, repo, pull_number) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`;
    const res = await axios_1.default.get(url, { headers });
    return res.data;
}
async function commentOnPR(owner, repo, issue_number, body) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`;
    const res = await axios_1.default.post(url, { body }, { headers });
    return res.data;
}
