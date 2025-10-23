import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ADMIN_TOKEN_KEY = 'kb_admin_token';

export default function AdminIndex() {
    const [token, setToken] = useState<string | null>(null);
    const [input, setInput] = useState('');

    useEffect(() => {
        const t = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
        if (t) setToken(t);
    }, []);

    const save = () => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(ADMIN_TOKEN_KEY, input);
        setToken(input);
        setInput('');
    };

    const logout = () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken(null);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--kb-purple)' }}>Admin</h1>

            {!token ? (
                <div className="mt-6">
                    <p>Enter admin token to unlock admin features:</p>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="admin token"
                        className="border p-2 rounded w-full mt-2"
                    />
                    <button className="btn-primary mt-3" onClick={save}>Save token</button>
                </div>
            ) : (
                <div className="mt-6">
                    <p>Logged in as admin (token stored in session).</p>
                    <div className="space-x-2 mt-3">
                        <Link href="/admin/events/new" className="btn-primary">Create Event</Link>
                        <Link href="/admin/bookings" className="btn-primary">View Bookings</Link>
                        <button className="ml-2 underline" onClick={logout}>Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
}
