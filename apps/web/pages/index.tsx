import React, { useEffect, useState } from 'react';
import { fetchEvents, bookEvent } from '../utils/api';
import EventItem from '../components/EventItem';
import type { Event } from '@kultur/types';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load events');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--kb-purple)' }}>KulturBooking (Dev)</h1>
        <p className="text-sm text-gray-500">Youth-driven events & pop-ups — local dev view</p>
      </header>

      <main>
        {loading && <p>Loading events…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="text-gray-500">No events found.</p>
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
    </div>
  );
};

export default HomePage;
