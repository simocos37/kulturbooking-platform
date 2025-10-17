import React, { useEffect, useState } from 'react';
import { getEvents } from '../lib/api';
import { bookEvent } from '../utils/api';
import EventItem from '../components/EventItem';
import type { Event } from '@kultur/types';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then(setEvents)
      .catch(e => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8 flex items-center gap-4">
        <img src="/logo.svg" alt="KulturBooking logo" width={48} height={48} className="rounded-xl shadow" />
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--kb-purple)' }}>KulturBooking</h1>
          <p className="text-base font-medium" style={{ color: 'var(--kb-yellow)' }}>Youth-driven events & pop-ups</p>
          <span className="text-xs text-gray-400">Local dev view</span>
        </div>
      </header>

      <main className="bg-white rounded-xl shadow-lg p-6">
        {loading && <p className="text-kb-muted">Loading events…</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="text-kb-muted">No events found.</p>
        )}
        <ul className="space-y-4">
          {events.map((e) => (
            <EventItem
              key={e.id}
              event={e}
              onBook={async (id) => {
                try {
                  await bookEvent(id);
                  alert('Booking confirmed (no payment)');
                } catch (err: any) {
                  alert('Could not book: ' + (err?.message || 'Unknown error'));
                }
              }}
            />
          ))}
        </ul>
      </main>
      <footer className="mt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} KulturBooking. For youth, by youth.
      </footer>
    </div>
  );
};

export default HomePage;
