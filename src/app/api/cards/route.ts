import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cardCreateSchema } from '@/lib/validations';

export async function GET() {
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

  const cards = await prisma.card.findMany({
    where: { profileId: profile.id },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json(cards.map(({ profileId: _pid, ...card }) => card));
}

export async function POST(req: Request) {
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
  const result = cardCreateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const card = await prisma.card.create({
    data: {
      profileId: profile.id,
      ...result.data,
      content: result.data.content as object,
      style: (result.data.style as object) ?? undefined,
    },
  });

  const { profileId: _pid, ...safeCard } = card;
  return NextResponse.json(safeCard, { status: 201 });
}
