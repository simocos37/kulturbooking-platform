import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';

type EventItem = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  lat?: number | null;
  lng?: number | null;
};

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/events').then((res) => {
      setEvents(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--kb-purple)' }}>KulturBooking (Dev)</h1>
        <p className="text-sm text-gray-500">Youth-driven events & pop-ups — local dev view</p>
      </header>

      <main>
        {loading ? <p>Loading events…</p> : null}
        <ul className="space-y-4">
          {events.map((e) => (
            <li key={e.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{e.title}</h2>
                  <p className="text-sm text-gray-600">{e.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Starts: {new Date(e.startAt).toLocaleString()}</p>
                </div>
                <div>
                  <Button onClick={() => {
                    axios.post('http://localhost:4000/api/bookings', { eventId: e.id })
                      .then(() => alert('Booking confirmed (no payment)'))
                      .catch((err) => alert('Could not book: ' + err.message));
                  }}>Book</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
