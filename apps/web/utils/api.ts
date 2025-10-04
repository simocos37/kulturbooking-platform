// apps/web/utils/api.ts
import type { Event } from '@kultur/types';
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function fetchEvents(): Promise<Event[]> {
    console.log('API_BASE:', API_BASE);
    const base = API_BASE || '';
    const res = await fetch(`${base}/api/v1/events`);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Events fetch failed: ${res.status} ${text}`);
    }
    const data: Event[] = await res.json();
    return data;
}

export async function bookEvent(eventId: string): Promise<any> {
    const base = API_BASE || '';
    const res = await fetch(`${base}/api/v1/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Booking failed: ${res.status} ${text}`);
    }
    return res.json();
}