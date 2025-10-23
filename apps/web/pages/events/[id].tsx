import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { Event } from '@kultur/types';
import { API_BASE } from '../../lib/api';

export default function EventPage() {
    const router = useRouter();
    const { id } = router.query;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`${API_BASE}/api/v1/events/${id}`)
            .then(r => r.ok ? r.json() : null)
            .then((event: Event | null) => event)
            .then(setEvent)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-6">Loading…</div>;
    if (!event) return <div className="p-6">Event not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--kb-purple)' }}>{event.title}</h1>
            <p className="text-kb-muted mt-2">Starts: {event.startAt ? new Date(event.startAt).toLocaleString() : 'Unknown'}</p>
            <p className="mt-4">{event.description}</p>
            <div className="mt-6">
                <button className="btn-primary" onClick={async () => {
                    try {
                        const response = await fetch(`${API_BASE}/api/v1/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId: event.id }) });
                        if (response.ok) {
                            alert('Booking confirmed (no payment)');
                        } else {
                            const text = await response.text().catch(() => '');
                            alert('Could not book: ' + (text || response.statusText));
                        }
                    } catch (err: unknown) {
                        const errorMsg = err && typeof err === 'object' && 'message' in err ? (err as any).message : '';
                        alert(`Booking failed${errorMsg ? `: ${errorMsg}` : ''}. Please check your connection and try again.`);
                    }
                }}>Book</button>
            </div>
        </div>
    );
}
