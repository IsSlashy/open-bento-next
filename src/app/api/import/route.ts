import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const importCardSchema = z.object({
  type: z.enum(['profile', 'social', 'media', 'map', 'github', 'text', 'link', 'title']),
  positionX: z.number().int().default(0),
  positionY: z.number().int().default(0),
  sizeWidth: z.number().int().min(1).max(8).default(2),
  sizeHeight: z.number().int().min(1).max(8).default(2),
  content: z.any(),
  style: z.any().optional().nullable(),
  zIndex: z.number().int().default(0),
  sortOrder: z.number().int().default(0),
});

const importSchema = z.object({
  version: z.number().optional(),
  profile: z
    .object({
      displayName: z.string().optional(),
      title: z.string().optional().nullable(),
      bio: z.string().optional().nullable(),
      avatarUrl: z.string().optional().nullable(),
      tags: z.array(z.string()).optional(),
      theme: z.string().optional(),
    })
    .optional(),
  cards: z.array(importCardSchema),
});

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

  try {
    const body = await req.json();
    const result = importSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid import data', details: result.error.issues },
        { status: 400 }
      );
    }

    const { profile: profileData, cards } = result.data;

    await prisma.$transaction(async (tx) => {
      // Update profile if provided
      if (profileData) {
        const updateData: Record<string, unknown> = {};
        if (profileData.displayName) updateData.displayName = profileData.displayName;
        if (profileData.title !== undefined) updateData.title = profileData.title;
        if (profileData.bio !== undefined) updateData.bio = profileData.bio;
        if (profileData.avatarUrl !== undefined) updateData.avatarUrl = profileData.avatarUrl;
        if (profileData.tags) updateData.tags = profileData.tags;
        if (profileData.theme) updateData.theme = profileData.theme;

        if (Object.keys(updateData).length > 0) {
          await tx.profile.update({
            where: { id: profile.id },
            data: updateData,
          });
        }
      }

      // Delete existing cards
      await tx.card.deleteMany({
        where: { profileId: profile.id },
      });

      // Create imported cards
      if (cards.length > 0) {
        await tx.card.createMany({
          data: cards.map((card, index) => ({
            profileId: profile.id,
            type: card.type,
            positionX: card.positionX,
            positionY: card.positionY,
            sizeWidth: card.sizeWidth,
            sizeHeight: card.sizeHeight,
            content: card.content,
            style: card.style ?? undefined,
            zIndex: card.zIndex,
            sortOrder: card.sortOrder || index,
          })),
        });
      }
    });

    return NextResponse.json({ success: true, cardsImported: cards.length });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
