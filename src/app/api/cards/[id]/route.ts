import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cardUpdateSchema } from '@/lib/validations';

async function getCardWithOwnership(cardId: string, userId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { profile: { select: { userId: true } } },
  });

  if (!card) return null;
  if (card.profile.userId !== userId) return null;

  return card;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const card = await getCardWithOwnership(params.id, session.user.id);
  if (!card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const { profileId: _pid, profile: _profile, ...safeCard } = card;
  return NextResponse.json(safeCard);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const card = await getCardWithOwnership(params.id, session.user.id);
  if (!card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const body = await req.json();
  const result = cardUpdateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};
  if (result.data.positionX !== undefined) updateData.positionX = result.data.positionX;
  if (result.data.positionY !== undefined) updateData.positionY = result.data.positionY;
  if (result.data.sizeWidth !== undefined) updateData.sizeWidth = result.data.sizeWidth;
  if (result.data.sizeHeight !== undefined) updateData.sizeHeight = result.data.sizeHeight;
  if (result.data.content !== undefined) updateData.content = result.data.content as object;
  if (result.data.style !== undefined) updateData.style = result.data.style as object ?? null;
  if (result.data.zIndex !== undefined) updateData.zIndex = result.data.zIndex;
  if (result.data.sortOrder !== undefined) updateData.sortOrder = result.data.sortOrder;

  const updated = await prisma.card.update({
    where: { id: params.id },
    data: updateData,
  });

  const { profileId: _pid2, ...safeUpdated } = updated;
  return NextResponse.json(safeUpdated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const card = await getCardWithOwnership(params.id, session.user.id);
  if (!card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  await prisma.card.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
