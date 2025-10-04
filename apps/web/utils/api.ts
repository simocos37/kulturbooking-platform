// apps/web/utils/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function fetchEvents() {
  const base = API_BASE || '';
  // If base is empty in production, this will call relative `/api/events`
  // but for our setup we expect NEXT_PUBLIC_API_URL to be set.
  const res = await fetch(`${base}/api/events`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Events fetch failed: ${res.status} ${text}`);
  }
  return res.json();
}
