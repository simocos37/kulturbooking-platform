// packages/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Upsert an organizer user (idempotent)
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@kultur.dev' },
    update: {},
    create: {
      email: 'organizer@kultur.dev',
      passwordHash: null,
      role: 'ORGANIZER',
      profile: { create: { displayName: 'Organizer Demo' } },
    },
  });

  // Upsert events (idempotent)
  const eventsData = [
    {
      id: 'evt1',
      title: 'Street Vibe — Pop-Up',
      description: 'Street arts and music pop-up — youth-led',
      startAt: new Date().toISOString(),
      organizerId: organizer.id,
    },
    {
      id: 'evt2',
      title: 'Young & Productive — Branding Workshop',
      description: 'Practical branding for emerging artists',
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      organizerId: organizer.id,
    },
  ];

  for (const ev of eventsData) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: {
        title: ev.title,
        description: ev.description,
        startAt: new Date(ev.startAt),
        organizerId: ev.organizerId,
      },
      create: {
        id: ev.id,
        title: ev.title,
        description: ev.description,
        startAt: new Date(ev.startAt),
        organizerId: ev.organizerId,
      },
    });
  }

  console.log('Seed complete (upsert)');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
