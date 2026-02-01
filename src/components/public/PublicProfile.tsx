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
        <div className="text-card">
          {card.content.data.title && (
            <h3 className="text-title">{card.content.data.title}</h3>
          )}
          <p className="text-body">{card.content.data.body}</p>
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
    <div className="min-h-screen">
      <div className="app">
        {/* Sidebar — same as editor but read-only */}
        <aside className="sidebar">
          <div className="profile">
            <div className="avatar-wrapper">
              <img src={profile.avatar} alt={profile.name} className="avatar" />
            </div>

            <h1 className="profile-name">{profile.name}</h1>

            {profile.title && (
              <p className="profile-title">{profile.title}</p>
            )}

            <ul className="profile-tags">
              {profile.tags.filter(Boolean).map((tag, i) => (
                <li key={i}>{tag}</li>
              ))}
            </ul>

            {profile.bio && (
              <div className="bio-wrapper">
                <p className="profile-bio">{profile.bio}</p>
              </div>
            )}
          </div>

          <footer className="sidebar-footer">
            <a
              href="/"
              className="footer-btn"
              title="Made with Open Bento"
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <rect width="14" height="14" rx="4" fill="#10b981" />
                <rect x="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.5" />
                <rect y="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.5" />
                <rect x="18" y="18" width="14" height="14" rx="4" fill="#10b981" opacity="0.3" />
              </svg>
            </a>
            <span className="footer-views">@{username}</span>
          </footer>
        </aside>

        {/* Grid — same layout as editor but no drag, no delete, no resize */}
        <main className="main-content">
          <div className="bento-grid">
            {gridCards.map((card) => (
              <div
                key={card.id}
                data-size={getSizeLabel(card)}
                className={cn(
                  'bento-card public-card',
                  card.type === 'title' && 'title-widget-card'
                )}
                style={{
                  gridColumn: `${card.position.x + 1} / span ${card.size.width}`,
                  gridRow: `${card.position.y + 1} / span ${card.size.height}`,
                }}
              >
                <div className="card-content-wrapper">
                  <PublicCardContent card={card} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
