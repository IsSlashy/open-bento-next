import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// DELETE — remove cards with oversized data-URL content (videos stored as base64)
// This unblocks profiles that can't load because of massive JSON payloads.
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Use raw SQL to find and delete cards with large content
  // (can't filter JSON field length easily with Prisma)
  const deleted = await prisma.$executeRaw`
    DELETE FROM "Card"
    WHERE "profileId" = ${profile.id}
      AND length(content::text) > 1000000
  `;

  return NextResponse.json({ deleted });
}
