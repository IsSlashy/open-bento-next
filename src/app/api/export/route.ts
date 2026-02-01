import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      cards: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: {
      displayName: profile.displayName,
      title: profile.title,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      tags: profile.tags,
      theme: profile.theme,
    },
    cards: profile.cards.map((card) => ({
      type: card.type,
      positionX: card.positionX,
      positionY: card.positionY,
      sizeWidth: card.sizeWidth,
      sizeHeight: card.sizeHeight,
      content: card.content,
      style: card.style,
      zIndex: card.zIndex,
      sortOrder: card.sortOrder,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="openbento-${session.user.username || 'export'}-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
