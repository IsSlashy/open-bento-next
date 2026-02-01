'use client';

import { useEffect, useRef } from 'react';
import { useBentoStore } from '@/lib/store';
import { BentoCard } from '@/lib/types';

interface StoreHydratorProps {
  profile: {
    avatar: string;
    name: string;
    title: string;
    tags: string[];
    bio: string;
  };
  cards: BentoCard[];
  children: React.ReactNode;
}

export function StoreHydrator({ profile, cards, children }: StoreHydratorProps) {
  const hydrate = useBentoStore((state) => state.hydrate);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrate(profile, cards);
      hydrated.current = true;
    }
  }, [profile, cards, hydrate]);

  return <>{children}</>;
}
