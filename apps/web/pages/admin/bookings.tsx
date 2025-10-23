import React, { useEffect, useState } from 'react';

const ADMIN_TOKEN_KEY = 'kb_admin_token';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
        if (!token) {
            setBookings([]);
            return;
        }
        const base = process.env.NEXT_PUBLIC_API_URL ?? '';
        fetch(`${base}/api/v1/bookings`, {
            headers: { 'x-admin-token': token }
        }).then(r => r.json()).then(setBookings).catch(console.error);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 style={{ color: 'var(--kb-purple)' }} className="text-2xl font-bold">Bookings</h1>
            <div className="mt-4">
                {bookings.length === 0 ? <p>No bookings</p> : (
                    <table className="w-full text-sm">
                        <thead><tr><th>ID</th><th>Event</th><th>User</th><th>Status</th><th>Created</th></tr></thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-2">{b.id}</td>
                                    <td className="p-2">{b.eventId}</td>
                                    <td className="p-2">{b.userId}</td>
                                    <td className="p-2">{b.status}</td>
                                    <td className="p-2">{new Date(b.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
