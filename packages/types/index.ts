// Shared types for KulturBooking

export type Event = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  lat?: number | null;
  lng?: number | null;
};

export type Booking = {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  role: string;
  profile?: Profile;
};

export type Profile = {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  tags?: any;
  media?: any;
};
