// Utility functions to convert Prisma models to shared types
import { Event, Booking, User, Profile } from '@kultur/types';
import { Event as PrismaEvent, Booking as PrismaBooking, User as PrismaUser, Profile as PrismaProfile } from '@prisma/client';

export function toEvent(e: PrismaEvent): Event {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    startAt: e.startAt instanceof Date ? e.startAt.toISOString() : String(e.startAt),
    lat: e.lat,
    lng: e.lng
  };
}

export function toBooking(b: PrismaBooking): Booking {
  return {
    id: b.id,
    eventId: b.eventId,
    userId: b.userId,
    status: String(b.status),
    createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : String(b.createdAt)
  };
}

export function toUser(u: PrismaUser & { profile?: PrismaProfile | null }): User {
  return {
    id: u.id,
    email: u.email,
    role: String(u.role),
    profile: u.profile ? toProfile(u.profile) : undefined
  };
}

export function toProfile(p: PrismaProfile): Profile {
  return {
    id: p.id,
    userId: p.userId,
    displayName: p.displayName,
    bio: p.bio ?? undefined,
    tags: p.tags,
    media: p.media
  };
}
