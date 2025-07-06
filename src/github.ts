import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const headers = {
  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'PR-Reviewer-Bot'
};

export interface ChangedFile {
  filename: string;
  patch?: string;
  [key: string]: any;
}

export async function getChangedFiles(
  owner: string,
  repo: string,
  pull_number: number
): Promise<ChangedFile[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`;
  const res = await axios.get(url, { headers });
  return res.data as ChangedFile[];
}

export async function commentOnPR(
  owner: string,
  repo: string,
  issue_number: number,
  body: string
): Promise<any> {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`;
  const res = await axios.post(url, { body }, { headers });
  return res.data;
}