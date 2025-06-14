import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const headers = {
  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'PR-Reviewer-Bot'
};

export async function getChangedFiles(owner, repo, pull_number) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`;
  const res = await fetch(url, { headers });
  return await res.json();
}

export async function commentOnPR(owner, repo, issue_number, body) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ body })
  });

  return await res.json();
}
