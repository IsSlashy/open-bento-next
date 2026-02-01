'use client';

import { Sidebar } from '@/components/Sidebar';
import { BentoGrid } from '@/components/BentoGrid';
import { Toolbar } from '@/components/Toolbar';
import { StoreHydrator } from './StoreHydrator';
import { BentoCard } from '@/lib/types';

interface EditorClientProps {
  profile: {
    avatar: string;
    name: string;
    title: string;
    tags: string[];
    bio: string;
  };
  cards: BentoCard[];
  username: string;
  profileId: string;
}

export function EditorClient({ profile, cards, username, profileId }: EditorClientProps) {
  return (
    <StoreHydrator profile={profile} cards={cards}>
      <div className="app">
        <Sidebar username={username} profileId={profileId} />
        <main className="main-content">
          <BentoGrid />
        </main>
      </div>
      <Toolbar username={username} />
    </StoreHydrator>
  );
}
