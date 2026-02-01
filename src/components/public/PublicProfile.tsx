'use client';

import { BentoCard as BentoCardType } from '@/lib/types';
import { SocialCard } from '@/components/cards/SocialCard';
import { GithubCard } from '@/components/cards/GithubCard';
import { LinkCard } from '@/components/cards/LinkCard';
import { MediaCard } from '@/components/cards/MediaCard';
import { MapCard } from '@/components/cards/MapCard';
import { cn } from '@/lib/utils';

interface PublicProfileProps {
  profile: {
    avatar: string;
    name: string;
    title: string;
    tags: string[];
    bio: string;
  };
  cards: BentoCardType[];
  username: string;
}

function PublicCardContent({ card }: { card: BentoCardType }) {
  switch (card.content.type) {
    case 'social':
      return <SocialCard content={card.content.data} style={card.style} />;
    case 'github':
      return <GithubCard content={card.content.data} />;
    case 'link':
      return <LinkCard content={card.content.data} style={card.style} />;
    case 'text':
      return (
        <div className="flex flex-col h-full p-5 bg-white dark:bg-zinc-800">
          {card.content.data.title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {card.content.data.title}
            </h3>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
            {card.content.data.body}
          </p>
        </div>
      );
    case 'media':
      return <MediaCard cardId={card.id} content={card.content.data} />;
    case 'map':
      return <MapCard content={card.content.data} />;
    case 'title':
      return (
        <div className="title-widget">
          <span className="widget-text">{card.content.data.text}</span>
        </div>
      );
    default:
      return null;
  }
}

export function PublicProfile({ profile, cards, username }: PublicProfileProps) {
  const gridCards = cards.filter((c) => c.type !== 'profile');

  const getSizeLabel = (card: BentoCardType) => `${card.size.width}x${card.size.height}`;

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-lg"
          />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {profile.name}
          </h1>
          {profile.title && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {profile.title}
            </p>
          )}
          {profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {profile.tags.filter(Boolean).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {profile.bio && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center max-w-md">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Bento Grid - read-only */}
        <div className="bento-grid">
          {gridCards.map((card) => (
            <div
              key={card.id}
              data-size={getSizeLabel(card)}
              className={cn(
                'bento-card public-card',
                card.type === 'title' && 'title-widget-card'
              )}
            >
              <div className="card-content-wrapper">
                <PublicCardContent card={card} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Made with Open Bento
          </a>
        </div>
      </div>
    </div>
  );
}
