import React from 'react';
import type { Event } from '@kultur/types';
import Button from '../components/Button';

interface EventItemProps {
  event: Event;
  onBook: (id: string) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onBook }) => (
  <li key={event.id} className="p-4 border rounded-lg shadow-sm" role="listitem" aria-label={`Event: ${event.title}`}
    style={{ background: '#fff', color: '#0f172a', borderColor: '#5b21b6' }}>
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: '#5b21b6' }}>{event.title}</h2>
        <p className="text-sm text-gray-600">{event.description ?? 'No description.'}</p>
        <p className="text-xs text-gray-500 mt-2">
          Starts: {event.startAt ? new Date(event.startAt).toLocaleString() : 'Unknown'}
        </p>
      </div>
      <div>
        <Button onClick={() => onBook(event.id)} aria-label={`Book event: ${event.title}`}>
          Book
        </Button>
      </div>
    </div>
  </li>
);

export default EventItem;
