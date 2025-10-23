import Link from 'next/link';
import React from 'react';

export default function Nav() {
    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo.svg" alt="KB" width={40} height={40} className="rounded" />
                    <Link href="/" className="text-lg font-bold" style={{ color: 'var(--kb-purple)' }}>KulturBooking</Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-sm text-kb-muted">Home</Link>
                    <Link href="/admin" className="btn-primary text-sm">Admin</Link>
                </div>
            </div>
        </nav>
    );
}
