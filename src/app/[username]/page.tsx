import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { dbCardToClient, dbProfileToClient } from '@/lib/converters';
import { PublicProfile } from '@/components/public/PublicProfile';

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
  const cards = user.profile.cards.map(dbCardToClient);

  return <PublicProfile profile={profile} cards={cards} username={params.username} />;
}
