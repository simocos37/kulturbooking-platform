// Centralized API helper for KulturBooking frontend
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function getEvents() {
  const base = API_BASE;
  const url = `${base}/api/events`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed fetch ${url}: ${res.status} ${text}`);
  }
  return res.json();
}

// Add more API helpers as needed, e.g. getBookings, getMapPoints, etc.
