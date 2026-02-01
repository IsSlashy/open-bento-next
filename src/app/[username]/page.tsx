import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { dbCardToClient, dbProfileToClient } from '@/lib/converters';
import { PublicProfile } from '@/components/public/PublicProfile';
import { createHash } from 'crypto';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      profile: true,
    },
  });

  if (!user || !user.profile) {
    return { title: 'Not Found - Open Bento' };
  }

  const profile = user.profile;
  const title = `${profile.displayName} - Open Bento`;
  const description = profile.bio || `Check out ${profile.displayName}'s portfolio`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [`/api/og/${params.username}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/${params.username}`],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      profile: {
        include: {
          cards: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  if (!user || !user.profile) {
    notFound();
  }

  if (!user.profile.isPublic) {
    notFound();
  }

  const profile = dbProfileToClient(user.profile);
  const cards = user.profile.cards
    .map((card) => {
      try { return dbCardToClient(card); }
      catch { return null; }
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  // Track page view — truly fire-and-forget (don't await, don't block render)
  headers().then((headersList) => {
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
      || headersList.get('x-real-ip')
      || 'unknown';
    const ipHash = createHash('sha256').update(ip).digest('hex');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    prisma.pageView.findFirst({
      where: {
        profileId: user.profile.id,
        ipHash,
        viewedAt: { gte: todayStart, lt: new Date(todayStart.getTime() + 86400000) },
      },
    }).then((existing) => {
      if (!existing) {
        prisma.pageView.create({
          data: { profileId: user.profile.id, ipHash, viewedAt: new Date() },
        }).catch(() => {});
      }
    }).catch(() => {});
  }).catch(() => {});

  return <PublicProfile profile={profile} cards={cards} username={params.username} />;
}
