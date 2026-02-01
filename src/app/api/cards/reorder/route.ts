import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { reorderSchema } from '@/lib/validations';

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const body = await req.json();
  const result = reorderSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  // Verify all cards belong to user
  const cardIds = result.data.map((item) => item.id);
  const cards = await prisma.card.findMany({
    where: {
      id: { in: cardIds },
      profileId: profile.id,
    },
  });

  if (cards.length !== cardIds.length) {
    return NextResponse.json({ error: 'Some cards not found' }, { status: 400 });
  }

  // Update in transaction
  await prisma.$transaction(
    result.data.map((item) =>
      prisma.card.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  return NextResponse.json({ success: true });
}
