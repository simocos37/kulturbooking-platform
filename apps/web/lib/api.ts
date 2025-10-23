// Centralized API helper for KulturBooking frontend
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function getEvents() {
    const base = API_BASE;
    const url = `${base}/api/v1/events`;
    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed fetch ${url}: ${res.status} ${text}`);
    }
    return res.json();
}

// Add more API helpers as needed, e.g. getBookings, getMapPoints, etc.
export async function createEvent(payload: any, adminToken: string) {
    const base = API_BASE;
    const url = `${base}/api/v1/events`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Create event failed: ${res.status} ${text}`);
    }
    return res.json();
}

export async function getBookings(adminToken: string) {
    const base = API_BASE;
    const url = `${base}/api/v1/bookings`;
    const res = await fetch(url, { headers: { 'x-admin-token': adminToken } });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Get bookings failed: ${res.status} ${text}`);
    }
    return res.json();
}
