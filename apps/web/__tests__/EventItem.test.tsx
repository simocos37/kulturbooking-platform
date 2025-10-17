import React from 'react';
import { render, screen } from '@testing-library/react';
import EventItem from '../components/EventItem';

const event = {
  id: 'evt1',
  title: 'Test Event',
  description: 'desc',
  startAt: new Date().toISOString(),
};

describe('EventItem', () => {
  it('renders event title and book button', () => {
    render(<EventItem event={event} onBook={() => {}} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book/i })).toBeInTheDocument();
  });
});
