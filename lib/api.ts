// lib/api.ts
const BACKEND_URL = "http://127.0.0.1:8010";

export async function fetchDocuments() {
  const res = await fetch(`${BACKEND_URL}/documents?limit=20`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}
