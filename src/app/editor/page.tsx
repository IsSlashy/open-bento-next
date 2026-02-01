import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { EditorClient } from '@/components/editor/EditorClient';
import { dbCardToClient, dbProfileToClient } from '@/lib/converters';

export const metadata = {
  title: 'Editor - Open Bento',
};

export default async function EditorPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!session.user.username) {
    redirect('/onboarding');
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
    // Create default profile
    await prisma.profile.create({
      data: {
        userId: session.user.id,
        displayName: session.user.name || 'Your Name',
      },
    });
    redirect('/editor');
  }

  const clientProfile = dbProfileToClient(profile);
  const clientCards = profile.cards.map(dbCardToClient);

  return (
    <EditorClient
      profile={clientProfile}
      cards={clientCards}
      username={session.user.username}
    />
  );
}
